
import { useState, useEffect } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, User, MapPin, CalendarDays } from "lucide-react";

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Profile {
  id: string;
  full_name: string;
  company_name: string;
  created_at: string;
  shipping_address: Address;
  billing_address: Address;
}

const AccountSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [billingAddress, setBillingAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      if (data.shipping_address) setShippingAddress(data.shipping_address);
      if (data.billing_address) setBillingAddress(data.billing_address);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveAddresses = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          shipping_address: shippingAddress,
          billing_address: billingAddress,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Addresses updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AddressForm = ({ 
    title, 
    address, 
    setAddress 
  }: { 
    title: string; 
    address: Address; 
    setAddress: (address: Address) => void;
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor={`${title}-line1`}>Address Line 1</Label>
          <Input
            id={`${title}-line1`}
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`${title}-line2`}>Address Line 2</Label>
          <Input
            id={`${title}-line2`}
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${title}-city`}>City</Label>
            <Input
              id={`${title}-city`}
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`${title}-state`}>State</Label>
            <Input
              id={`${title}-state`}
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${title}-postal`}>Postal Code</Label>
            <Input
              id={`${title}-postal`}
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`${title}-country`}>Country</Label>
            <Input
              id={`${title}-country`}
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (!profile) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8">Loading...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-2xl font-semibold">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{profile.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="font-medium">{profile.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="font-medium">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-navy hover:bg-navy-dark"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-6">
              <AddressForm
                title="Shipping Address"
                address={shippingAddress}
                setAddress={setShippingAddress}
              />
              <AddressForm
                title="Billing Address"
                address={billingAddress}
                setAddress={setBillingAddress}
              />
              <Button
                className="w-full"
                onClick={handleSaveAddresses}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Addresses"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AccountSettings;
