
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CheckSquare } from "lucide-react";

type Order = {
  id: string;
  part_name: string;
  quantity: number;
  price: number;
  status: string;
  delivery_date: string;
};

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  working: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  complete: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
} as const;

const ViewOrders = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
        throw error;
      }

      return data as Order[];
    },
  });

  const filterOrdersByStatus = (status: string | null) => {
    if (!orders) return [];
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">View Orders</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="working">Working</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {["all", "pending", "working", "complete", "cancelled"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left">Order ID</th>
                      <th className="p-4 text-left">Part Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Price</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Delivery Date</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : filterOrdersByStatus(status === "all" ? null : status).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filterOrdersByStatus(status === "all" ? null : status).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4">{order.id.slice(0, 8)}</td>
                          <td className="p-4">{order.part_name}</td>
                          <td className="p-4">{order.quantity}</td>
                          <td className="p-4">${order.price.toFixed(2)}</td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className={statusColors[order.status as keyof typeof statusColors]}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {new Date(order.delivery_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  toast({
                                    title: "Coming Soon",
                                    description: "Comments feature will be added soon",
                                  });
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  toast({
                                    title: "Coming Soon",
                                    description: "Tasks feature will be added soon",
                                  });
                                }}
                              >
                                <CheckSquare className="h-4 w-4" />
                              </Button>
                            </div>
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

export default ViewOrders;
