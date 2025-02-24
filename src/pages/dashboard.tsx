
import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Quote, Package, Check, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Define explicit types for our data structures
interface Profile {
  full_name: string | null;
}

interface DashboardMetrics {
  totalRfqs: number;
  activeQuotes: number;
  ordersInProgress: number;
  completedOrders: number;
}

// Define default metrics state
const defaultMetrics: DashboardMetrics = {
  totalRfqs: 0,
  activeQuotes: 0,
  ordersInProgress: 0,
  completedOrders: 0
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");

  // Profile query with explicit typing
  const { data: profile } = useQuery<Profile | null, Error>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setUserName(data.full_name || '');
      }
      
      return data;
    },
    meta: {
      errorCallback: () => {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      }
    }
  });

  // Metrics query with explicit typing
  const { data: metrics = defaultMetrics } = useQuery<DashboardMetrics, Error>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Optimized count queries using parallel execution
      const [rfqsResult, quotesResult, inProgressResult, completedResult] = await Promise.all([
        supabase
          .from("rfqs")
          .select("id", { count: 'exact' })
          .eq("user_id", user.id),
        
        supabase
          .from("quotes")
          .select("id", { count: 'exact' })
          .eq("user_id", user.id)
          .in("status", ["pending", "quoted"]),

        supabase
          .from("orders")
          .select("id", { count: 'exact' })
          .eq("user_id", user.id)
          .in("status", ["pending", "working"]),

        supabase
          .from("orders")
          .select("id", { count: 'exact' })
          .eq("user_id", user.id)
          .eq("status", "complete")
      ]);

      return {
        totalRfqs: rfqsResult.count || 0,
        activeQuotes: quotesResult.count || 0,
        ordersInProgress: inProgressResult.count || 0,
        completedOrders: completedResult.count || 0
      };
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Set up realtime subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'orders'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'quotes'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    onClick 
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    onClick: () => void;
  }) => (
    <Card
      className="p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-navy">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
        <Icon className="h-8 w-8 text-navy opacity-80" />
      </div>
    </Card>
  );

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-navy">
            Welcome, {userName}
          </h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search quotes and orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total RFQs Submitted"
            value={metrics.totalRfqs}
            icon={Upload}
            onClick={() => navigate("/submit-rfq")}
          />
          <MetricCard
            title="Active Quotes"
            value={metrics.activeQuotes}
            icon={Quote}
            onClick={() => navigate("/quotes")}
          />
          <MetricCard
            title="Orders In Progress"
            value={metrics.ordersInProgress}
            icon={Package}
            onClick={() => navigate("/orders")}
          />
          <MetricCard
            title="Completed Orders"
            value={metrics.completedOrders}
            icon={Check}
            onClick={() => navigate("/orders?status=complete")}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
