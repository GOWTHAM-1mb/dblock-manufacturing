
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

interface Profile {
  full_name: string | null;
}

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const { data: metrics } = useDashboardMetrics();

  const { data: profile } = useQuery<Profile | null>({
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

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-navy">
            Welcome, {userName}
          </h1>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <DashboardMetrics metrics={metrics} />
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
