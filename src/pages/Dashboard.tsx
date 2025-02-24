import { useState, useEffect } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Button } from "@/components/ui/button";
import { seedDummyData } from "@/seed-data";

interface Profile {
  full_name: string | null;
}

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const { data: metrics, isLoading } = useDashboardMetrics();

  const handleSeedData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      await seedDummyData(user.id);
      await queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      
      toast({
        title: "Success",
        description: "Dummy data has been added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add dummy data: " + error.message,
        variant: "destructive",
      });
    }
  };

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

  // Default metrics while loading
  const defaultMetrics = {
    totalRfqs: 0,
    activeQuotes: 0,
    ordersInProgress: 0,
    completedOrders: 0
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-navy">
            Welcome, {userName}
          </h1>
          <div className="flex gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <Button 
              variant="outline" 
              onClick={handleSeedData}
              className="whitespace-nowrap"
            >
              Add Test Data
            </Button>
          </div>
        </div>
        <DashboardMetrics metrics={metrics || defaultMetrics} />
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
