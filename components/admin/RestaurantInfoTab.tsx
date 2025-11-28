"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { ExtendedRestaurantInfo } from "@/types/types";

interface RestaurantInfoTabProps {
  initialInfo: ExtendedRestaurantInfo | null;
}

export default function RestaurantInfoTab({ initialInfo }: RestaurantInfoTabProps) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<ExtendedRestaurantInfo | null>(initialInfo);

  const updateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "PUT",
        body: JSON.stringify(info),
      });
      if (res.ok) toast.success("Info updated!");
    } catch (e) {
      toast.error("Error updating info");
    }
    setLoading(false);
  };

  if (!info) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-red-500">
          Failed to load info. Please check database connection.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Restaurant Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={updateInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Restaurant Name</Label>
              <Input
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Tagline</Label>
              <Input
                value={info.tagline}
                onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label>Phone</Label>
              <Input
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label>Email</Label>
              <Input
                type="email"
                value={info.email || ""}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                placeholder="info@example.com"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Address</Label>
              <Input
                value={info.address || ""}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                placeholder="Full Address"
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
          <Button type="submit" disabled={loading} className="w-full md:w-auto mt-4">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}