
import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";

const ACCEPTED_FILE_TYPES = {
  step: [".step", ".stp"],
  drawing: [".pdf"],
};

const MATERIAL_OPTIONS = [
  { value: "aluminum", label: "Aluminum" },
  { value: "steel", label: "Steel" },
  { value: "plastic", label: "Plastic" },
  { value: "other", label: "Other" },
];

const SubmitRFQ = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepFile, setStepFile] = useState<File | null>(null);
  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const { toast } = useToast();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, fileType: "step" | "drawing") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && ACCEPTED_FILE_TYPES[fileType].some(ext => file.name.toLowerCase().endsWith(ext))) {
      fileType === "step" ? setStepFile(file) : setDrawingFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${fileType.toUpperCase()} file`,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: "step" | "drawing") => {
    const file = e.target.files?.[0];
    if (file) {
      fileType === "step" ? setStepFile(file) : setDrawingFile(file);
    }
  };

  const uploadFile = async (file: File, userId: string, fileType: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${fileType}_${Date.now()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('rfq-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stepFile || !drawingFile || !material || !quantity || !deliveryDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const stepFilePath = await uploadFile(stepFile, user.id, 'step');
      const drawingFilePath = await uploadFile(drawingFile, user.id, 'drawing');

      const { error: rfqError } = await supabase
        .from('rfqs')
        .insert({
          user_id: user.id,
          material,
          quantity,
          special_instructions: instructions,
          expected_delivery_date: deliveryDate.toISOString(),
          step_file_path: stepFilePath,
          drawing_file_path: drawingFilePath,
        });

      if (rfqError) throw rfqError;

      toast({
        title: "Success",
        description: "RFQ submitted successfully! You will receive a quote within an hour.",
      });

      // Reset form
      setStepFile(null);
      setDrawingFile(null);
      setMaterial("");
      setQuantity(1);
      setInstructions("");
      setDeliveryDate(undefined);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploader = ({ fileType, file, setFile }: {
    fileType: "step" | "drawing",
    file: File | null,
    setFile: (file: File | null) => void
  }) => (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleFileDrop(e, fileType)}
    >
      <input
        type="file"
        id={`${fileType}-file`}
        className="hidden"
        accept={ACCEPTED_FILE_TYPES[fileType].join(",")}
        onChange={(e) => handleFileChange(e, fileType)}
      />
      <Label
        htmlFor={`${fileType}-file`}
        className="flex flex-col items-center gap-2 cursor-pointer"
      >
        <Upload className="h-8 w-8 text-gray-400" />
        {file ? (
          <span className="text-sm text-gray-600">{file.name}</span>
        ) : (
          <>
            <span className="text-sm font-medium">
              Drop your {fileType.toUpperCase()} file here or click to browse
            </span>
            <span className="text-xs text-gray-500">
              {ACCEPTED_FILE_TYPES[fileType].join(", ")} files only
            </span>
          </>
        )}
      </Label>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Submit RFQ</h1>
          <p className="text-gray-600">Upload your files and provide specifications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>STEP File</Label>
              <FileUploader
                fileType="step"
                file={stepFile}
                setFile={setStepFile}
              />
            </div>

            <div className="space-y-4">
              <Label>Drawing (PDF)</Label>
              <FileUploader
                fileType="drawing"
                file={drawingFile}
                setFile={setDrawingFile}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Material</Label>
              <Select
                value={material}
                onValueChange={setMaterial}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expected Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Enter any special instructions or requirements..."
            />
            <p className="text-xs text-gray-500 text-right">
              {instructions.length}/500 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-navy hover:bg-navy/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit RFQ"}
          </Button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default SubmitRFQ;
