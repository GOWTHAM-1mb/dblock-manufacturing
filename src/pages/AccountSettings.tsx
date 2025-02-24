
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export const AccountSettings = () => {
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Account settings content will go here.</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
