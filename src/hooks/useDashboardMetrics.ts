
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardMetrics {
  totalRfqs: number;
  activeQuotes: number;
  ordersInProgress: number;
  completedOrders: number;
}

export const useDashboardMetrics = () => {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Fetch counts in parallel
      const [rfqs, quotes, inProgress, completed] = await Promise.all([
        supabase.from("rfqs").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
        supabase.from("quotes").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
        supabase.from("orders").select("*", { count: 'exact', head: true }).eq("user_id", user.id).eq("status", "in_progress"),
        supabase.from("orders").select("*", { count: 'exact', head: true }).eq("user_id", user.id).eq("status", "completed")
      ]);

      return {
        totalRfqs: rfqs.count || 0,
        activeQuotes: quotes.count || 0,
        ordersInProgress: inProgress.count || 0,
        completedOrders: completed.count || 0
      };
    }
  });
};
