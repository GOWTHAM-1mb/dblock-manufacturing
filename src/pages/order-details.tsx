
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

type Order = {
  id: string;
  part_name: string;
  material: string;
  quantity: number;
  price: number;
  status: string;
  delivery_date: string;
  step_file_path: string | null;
  drawing_file_path: string | null;
};

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  working: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  complete: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
} as const;

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        });
        throw error;
      }

      return data as Order;
    },
  });

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("order_files")
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8">Loading...</div>
      </AuthenticatedLayout>
    );
  }

  if (!order) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8">Order not found</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <Button variant="outline" onClick={() => navigate("/orders")}>
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant="secondary"
                    className={statusColors[order.status as keyof typeof statusColors]}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Part Name</p>
                  <p className="font-medium">{order.part_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium">{order.material}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${order.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Date</p>
                  <p className="font-medium">
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Files</h2>
              <div className="space-y-4">
                {order.step_file_path && (
                  <div className="flex items-center justify-between">
                    <span>STEP File</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          order.step_file_path!,
                          `${order.part_name}_step.step`
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                {order.drawing_file_path && (
                  <div className="flex items-center justify-between">
                    <span>Drawing File</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          order.drawing_file_path!,
                          `${order.part_name}_drawing.pdf`
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                {!order.step_file_path && !order.drawing_file_path && (
                  <p className="text-gray-500">No files uploaded</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <Button
                className="w-full bg-navy hover:bg-navy-dark"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Invoice download feature will be added soon",
                  });
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default OrderDetails;
