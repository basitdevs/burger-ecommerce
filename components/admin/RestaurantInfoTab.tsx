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
  
  // Use state to handle inputs. Ensure defaults are empty strings to prevent errors.
  const [info, setInfo] = useState<ExtendedRestaurantInfo>(initialInfo || {
    id: 0,
    name: "", name_ar: "",
    tagline: "", tagline_ar: "",
    logoUrl: "",
    phone: "",
    address: "", address_ar: "",
    email: ""
  });

  const updateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
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
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update info");
      }
    } catch (e) {
      toast.error("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Restaurant Information</CardTitle>
        <CardDescription>Update your store details for both English and Arabic.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={updateInfo} className="space-y-6">
          
          {/* Section: Basic Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
             <div className="space-y-2">
              <Label>Restaurant Name (EN)</Label>
              <Input
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">اسم المطعم (AR)</Label>
              <Input
                dir="rtl"
                value={info.name_ar || ""}
                onChange={(e) => setInfo({ ...info, name_ar: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tagline (EN)</Label>
              <Input
                value={info.tagline}
                onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">شعار المطعم (AR)</Label>
              <Input
                dir="rtl"
                value={info.tagline_ar || ""}
                onChange={(e) => setInfo({ ...info, tagline_ar: e.target.value })}
              />
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={info.email || ""}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Address (EN)</Label>
              <Input
                value={info.address || ""}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-right block">العنوان (AR)</Label>
              <Input
                dir="rtl"
                value={info.address_ar || ""}
                onChange={(e) => setInfo({ ...info, address_ar: e.target.value })}
              />
            </div>

             <div className="md:col-span-2 space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={info.logoUrl}
                onChange={(e) => setInfo({ ...info, logoUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto min-w-[150px]">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}