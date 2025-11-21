"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/context/AuthContext";
import { toast } from "sonner";

export default function ShippingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    block: "",
    street: "",
    house: "",
    avenue: "",
    specialDirections: "",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prevForm) => ({
        ...prevForm,
        name: user.name,
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.block ||
      !form.street ||
      !form.house
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    console.log("Shipping Details Submitted:", form);
    toast.success("Shipping address saved successfully!");

    router.push("/payment");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Shipping Information
          </CardTitle>
          <CardDescription>
            Please enter your delivery details below.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-2">
                  <Label htmlFor="name" className="mb-2">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="phone" className="mb-2">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="mb-2">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-2">
                  <Label htmlFor="block" className="mb-2">Block</Label>
                  <Input
                    id="block"
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="street" className="mb-2">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="house" className="mb-2">House</Label>
                  <Input
                    id="house"
                    name="house"
                    value={form.house}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <Label htmlFor="avenue" className="mb-2">Avenue (Optional)</Label>
                <Input
                  id="avenue"
                  name="avenue"
                  value={form.avenue}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="specialDirections" className="mb-2">Special Directions</Label>
                <textarea
                  id="specialDirections"
                  name="specialDirections"
                  value={form.specialDirections}
                  onChange={handleChange}
                  rows={3}
                  className="w-full mt-1 p-2 border rounded-md dark:bg-input/30"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full mt-3">
              Proceed to Payment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
