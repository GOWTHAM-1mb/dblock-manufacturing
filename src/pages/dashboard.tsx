
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const Dashboard = () => {
  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
