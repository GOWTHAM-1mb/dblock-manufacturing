
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Quote = {
  id: string;
  rfq_id: string;
  quoted_price: number;
  created_at: string;
  rfq: {
    material: string;
    status: string;
  };
};

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  quoted: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  accepted: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  rejected: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
} as const;

const ViewQuotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data: quotes, error } = await supabase
        .from("quotes")
        .select(`
          *,
          rfq:rfqs (
            material,
            status
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch quotes",
          variant: "destructive",
        });
        throw error;
      }

      return quotes as Quote[];
    },
  });

  const filterQuotesByStatus = (status: string | null) => {
    if (!quotes) return [];
    if (!status) return quotes;
    return quotes.filter((quote) => quote.rfq.status === status);
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">View Quotes</h1>
          <Button onClick={() => navigate("/submit-rfq")}>Submit RFQ</Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="quoted">Quoted</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {["all", "pending", "quoted", "accepted", "rejected"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left">Quote ID</th>
                      <th className="p-4 text-left">Material</th>
                      <th className="p-4 text-left">Quoted Price</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : filterQuotesByStatus(status === "all" ? null : status).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          No quotes found
                        </td>
                      </tr>
                    ) : (
                      filterQuotesByStatus(status === "all" ? null : status).map((quote) => (
                        <tr key={quote.id} className="border-b">
                          <td className="p-4">{quote.id.slice(0, 8)}</td>
                          <td className="p-4">{quote.rfq.material}</td>
                          <td className="p-4">${quote.quoted_price.toFixed(2)}</td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className={statusColors[quote.rfq.status as keyof typeof statusColors]}
                            >
                              {quote.rfq.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement view details
                                toast({
                                  title: "Coming Soon",
                                  description: "View details functionality will be added soon",
                                });
                              }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
};

export default ViewQuotes;
