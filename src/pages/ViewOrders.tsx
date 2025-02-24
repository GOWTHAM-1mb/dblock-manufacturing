
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const ViewOrders = () => {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-navy">Orders</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Your orders will appear here.</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ViewOrders;
