
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export const Dashboard = () => {
  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
    </AuthenticatedLayout>
  );
};
