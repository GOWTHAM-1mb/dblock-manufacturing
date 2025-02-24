
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const ViewQuotes = () => {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-navy">Quotes</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Your quotes will appear here.</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ViewQuotes;
