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
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Context

export default function ShippingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // 2. Get Language
  const { language } = useLanguage();

  // 3. Define Translations
  const t = {
    en: {
      title: "Shipping Information",
      desc: "Please enter your delivery details below.",
      secContact: "Contact Information",
      secAddress: "Address Information",
      
      // Labels
      name: "Name",
      phone: "Phone Number",
      email: "Email",
      block: "Block",
      street: "Street",
      house: "House",
      avenue: "Avenue (Optional)",
      directions: "Special Directions",
      
      // Actions/Messages
      btnProceed: "Proceed to Payment",
      errRequired: "Please fill in all required fields.",
      successMsg: "Shipping address saved successfully!"
    },
    ar: {
      title: "معلومات التوصيل",
      desc: "يرجى إدخال تفاصيل العنوان أدناه.",
      secContact: "معلومات الاتصال",
      secAddress: "العنوان",
      
      // Labels
      name: "الاسم",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      block: "القطعة",
      street: "الشارع",
      house: "المنزل",
      avenue: "جادة (اختياري)",
      directions: "تعليمات خاصة",
      
      // Actions/Messages
      btnProceed: "متابعة الدفع",
      errRequired: "يرجى تعبئة جميع الحقول المطلوبة.",
      successMsg: "تم حفظ عنوان التوصيل بنجاح!"
    }
  };

  const content = t[language];

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
      toast.error(content.errRequired);
      return;
    }

    console.log("Shipping Details Submitted:", form);
    toast.success(content.successMsg);

    router.push("/payment");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {content.title}
          </CardTitle>
          <CardDescription>
            {content.desc}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {content.secContact}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-2">
                  <Label htmlFor="name" className="mb-2 block text-start">{content.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="phone" className="mb-2 block text-start">{content.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="text-start" // Ensures phone number direction looks correct
                    dir="ltr" // Force LTR for phone numbers usually preferred, optional
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="mb-2 block text-start">{content.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="text-start"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {content.secAddress}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-2">
                  <Label htmlFor="block" className="mb-2 block text-start">{content.block}</Label>
                  <Input
                    id="block"
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="street" className="mb-2 block text-start">{content.street}</Label>
                  <Input
                    id="street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="house" className="mb-2 block text-start">{content.house}</Label>
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
                <Label htmlFor="avenue" className="mb-2 block text-start">{content.avenue}</Label>
                <Input
                  id="avenue"
                  name="avenue"
                  value={form.avenue}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="specialDirections" className="mb-2 block text-start">{content.directions}</Label>
                <textarea
                  id="specialDirections"
                  name="specialDirections"
                  value={form.specialDirections}
                  onChange={handleChange}
                  rows={3}
                  className="w-full mt-1 p-2 border rounded-md dark:bg-input/30 bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full mt-3">
              {content.btnProceed}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}