
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardMetricsData } from "@/components/dashboard/DashboardMetrics";

const defaultMetrics: DashboardMetricsData = {
  totalRfqs: 0,
  activeQuotes: 0,
  ordersInProgress: 0,
  completedOrders: 0
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

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
    initialData: defaultMetrics
  });
};
