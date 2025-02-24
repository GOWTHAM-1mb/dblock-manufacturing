
import { useNavigate } from "react-router-dom";
import { Upload, Quote, Package, Check } from "lucide-react";
import { MetricCard } from "./MetricCard";

export interface DashboardMetricsData {
  totalRfqs: number;
  activeQuotes: number;
  ordersInProgress: number;
  completedOrders: number;
}

interface DashboardMetricsProps {
  metrics: DashboardMetricsData;
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};
