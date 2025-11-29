"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { ExtendedRestaurantInfo } from "@/types/types";
import { useRouter } from "next/navigation";

interface RestaurantInfoTabProps {
  initialInfo: ExtendedRestaurantInfo | null;
}

export default function RestaurantInfoTab({ initialInfo }: RestaurantInfoTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Initialize with empty strings for optional fields to avoid "uncontrolled input" warnings
  const [info, setInfo] = useState<ExtendedRestaurantInfo | null>(initialInfo);

  const updateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Restaurant settings updated successfully!");
        router.refresh(); // Refresh server components to show new data elsewhere
      } else {
        toast.error(data.message || "Failed to update info");
      }
    } catch (e) {
      toast.error("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  if (!info) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center text-red-600">
          Failed to load restaurant information. Please check your database connection.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Restaurant Information</CardTitle>
        <CardDescription>Update your store details, contact info, and branding.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={updateInfo} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                placeholder="e.g. Burger King"
              />
            </div>

            {/* Tagline */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={info.tagline}
                onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                placeholder="e.g. Taste the difference"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                placeholder="+965 ..."
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={info.email || ""}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                placeholder="info@restaurant.com"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={info.address || ""}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                placeholder="Street, Block, City..."
              />
            </div>

            {/* Logo URL */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={info.logoUrl}
                onChange={(e) => setInfo({ ...info, logoUrl: e.target.value })}
                placeholder="https://..."
              />
              {info.logoUrl && (
                <div className="mt-2 p-2 border rounded-md inline-block bg-gray-50">
                  <img 
                    src={info.logoUrl} 
                    alt="Logo Preview" 
                    className="h-12 w-auto object-contain" 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto min-w-[150px]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}