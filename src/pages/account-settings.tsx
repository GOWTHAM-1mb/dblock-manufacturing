
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, MapPin, User, Calendar } from "lucide-react";
import { resetPassword } from "@/lib/auth";
import { format } from "date-fns";

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface UserProfile {
  full_name: string;
  company_name: string;
  shipping_address: Address;
  billing_address: Address;
  created_at: string;
}

export const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(profileData);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [toast]);

  const handleResetPassword = async () => {
    try {
      await resetPassword(userEmail);
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

  const handleAddressUpdate = async (type: 'shipping' | 'billing', address: Address) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const updates = type === 'shipping' 
        ? { shipping_address: address }
        : { billing_address: address };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        [type === 'shipping' ? 'shipping_address' : 'billing_address']: address
      } : null);

      toast({
        title: "Success",
        description: `${type === 'shipping' ? 'Shipping' : 'Billing'} address updated successfully`,
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

  const AddressForm = ({ type, initialAddress, onSubmit }: { 
    type: 'shipping' | 'billing', 
    initialAddress?: Address,
    onSubmit: (address: Address) => void 
  }) => {
    const [address, setAddress] = useState<Address>(initialAddress || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    });

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(address);
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${type}-line1`}>Address Line 1</Label>
              <Input
                id={`${type}-line1`}
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                placeholder="Street address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${type}-line2`}>Address Line 2</Label>
              <Input
                id={`${type}-line2`}
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                placeholder="Apartment, suite, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${type}-city`}>City</Label>
                <Input
                  id={`${type}-city`}
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${type}-state`}>State</Label>
                <Input
                  id={`${type}-state`}
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${type}-postal`}>Postal Code</Label>
                <Input
                  id={`${type}-postal`}
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${type}-country`}>Country</Label>
                <Input
                  id={`${type}-country`}
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Updating..." : "Update Address"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.full_name}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userEmail}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Company</Label>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.company_name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Join Date</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {profile?.created_at 
                      ? format(new Date(profile.created_at), 'MMMM d, yyyy')
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleResetPassword}
                className="w-full bg-navy hover:bg-navy-light mt-4"
              >
                Reset Password
              </Button>
            </CardContent>
          </Card>

          {/* Address Forms */}
          <div className="lg:col-span-2 space-y-6">
            <AddressForm
              type="shipping"
              initialAddress={profile?.shipping_address}
              onSubmit={(address) => handleAddressUpdate('shipping', address)}
            />
            <AddressForm
              type="billing"
              initialAddress={profile?.billing_address}
              onSubmit={(address) => handleAddressUpdate('billing', address)}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
