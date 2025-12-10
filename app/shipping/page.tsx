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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Imported Select components
import { useAuth } from "@/components/context/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

// --- 1. Kuwait Locations Data ---
const kuwaitLocations = [
  {
    en: "Capital (Al Asimah)",
    ar: "العاصمة",
    areas: [
      { en: "Kuwait City", ar: "مدينة الكويت" },
      { en: "Sharq", ar: "شرق" },
      { en: "Mirqab", ar: "المرقاب" },
      { en: "Dasman", ar: "دسمان" },
      { en: "Qibla", ar: "القبلة" },
      { en: "Shamiya", ar: "الشامية" },
      { en: "Rawda", ar: "الروضة" },
      { en: "Adailiya", ar: "العديلية" },
      { en: "Khaldiya", ar: "الخالدية" },
      { en: "Qadsiya", ar: "القادسية" },
      { en: "Yarmouk", ar: "اليرموك" },
      { en: "Sulaibikhat", ar: "الصليبيخات" },
      { en: "Doha", ar: "الدوحة" },
      { en: "Ghonaiem", ar: "الغنيم" },
      { en: "Mubarakiya", ar: "المباركية" },
    ],
  },
  {
    en: "Hawally",
    ar: "حولي",
    areas: [
      { en: "Hawally", ar: "حولي" },
      { en: "Salmiya", ar: "السالمية" },
      { en: "Jabriya", ar: "الجابرية" },
      { en: "Maidan Hawally", ar: "ميدان حولي" },
      { en: "Bayan", ar: "بيان" },
      { en: "Mishref", ar: "مشرف" },
      { en: "Salwa", ar: "سلوى" },
      { en: "Rumaithiya", ar: "الرميثية" },
      { en: "Shaab", ar: "الشعب" },
      { en: "Salam", ar: "السلام" },
      { en: "Hitteen", ar: "حطين" },
      { en: "Zahra", ar: "الزهراء" },
      { en: "Mubarak Al-Abdullah", ar: "مبارك العبدالله" },
      { en: "Siddiq", ar: "الصديق" },
      { en: "Shuhada", ar: "الشهداء" },
    ],
  },
  {
    en: "Farwaniya",
    ar: "الفروانية",
    areas: [
      { en: "Farwaniya", ar: "الفروانية" },
      { en: "Khaitan", ar: "خيطان" },
      { en: "Andalous", ar: "الأندلس" },
      { en: "Ishbiliya", ar: "اشبيلية" },
      { en: "Jleeb Al-Shuyoukh", ar: "جليب الشيوخ" },
      { en: "Omariya", ar: "العمرية" },
      { en: "Rabiya", ar: "الرابية" },
      { en: "Riggae", ar: "الرقعي" },
      { en: "Sabah Al-Nasser", ar: "صباح الناصر" },
      { en: "Firdous", ar: "الفردوس" },
      { en: "Ardiya", ar: "العارضية" },
      { en: "Abdullah Al-Mubarak", ar: "عبدالله المبارك" },
    ],
  },
  {
    en: "Mubarak Al-Kabeer",
    ar: "مبارك الكبير",
    areas: [
      { en: "Mubarak Al-Kabeer", ar: "مبارك الكبير" },
      { en: "Adan", ar: "العدان" },
      { en: "Qurain", ar: "القرين" },
      { en: "Qusour", ar: "القصور" },
      { en: "Sabah Al-Salem", ar: "صباح السالم" },
      { en: "Messila", ar: "المسيلة" },
      { en: "Abu Al Hasaniya", ar: "أبو الحصانية" },
      { en: "Funaitees", ar: "الفنيطيس" },
    ],
  },
  {
    en: "Ahmadi",
    ar: "الأحمدي",
    areas: [
      { en: "Ahmadi", ar: "الأحمدي" },
      { en: "Fahaheel", ar: "الفحيحيل" },
      { en: "Mangaf", ar: "المنقف" },
      { en: "Sabahiya", ar: "الصباحية" },
      { en: "Egaila", ar: "العقيلة" },
      { en: "Riqqa", ar: "الرقة" },
      { en: "Mahboula", ar: "المهبولة" },
      { en: "Abu Halifa", ar: "أبو حليفة" },
      { en: "Khiran", ar: "الخيران" },
      { en: "Wafra", ar: "الوفرة" },
      { en: "Sabah Al-Ahmad", ar: "مدينة صباح الأحمد" },
      { en: "Ali Sabah Al-Salem", ar: "علي صباح السالم" },
      { en: "Bnaider", ar: "بنيدر" },
      { en: "Julaia", ar: "الجليعة" },
    ],
  },
  {
    en: "Jahra",
    ar: "الجهراء",
    areas: [
      { en: "Jahra", ar: "الجهراء" },
      { en: "Sulaibiya", ar: "الصليبية" },
      { en: "Saad Al-Abdullah", ar: "سعد العبدالله" },
      { en: "Mutlaa", ar: "المطلاع" },
      { en: "Qairawan", ar: "القيروان" },
      { en: "Abdali", ar: "العبدلي" },
      { en: "Naseem", ar: "النسيم" },
      { en: "Tima", ar: "تيماء" },
      { en: "Oyoun", ar: "العيون" },
    ],
  },
];

export default function ShippingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();

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
      area: "Area",
      areaPlace: "Select your area",
      block: "Block",
      street: "Street",
      house: "House",
      avenue: "Avenue (Optional)",
      directions: "Special Directions",

      // Actions/Messages
      btnProceed: "Proceed to Payment",
      errRequired: "Please fill in all required fields.",
      successMsg: "Shipping address saved successfully!",
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
      area: "المنطقة",
      areaPlace: "اختر منطقتك",
      block: "القطعة",
      street: "الشارع",
      house: "المنزل",
      avenue: "جادة (اختياري)",
      directions: "تعليمات خاصة",

      // Actions/Messages
      btnProceed: "متابعة الدفع",
      errRequired: "يرجى تعبئة جميع الحقول المطلوبة.",
      successMsg: "تم حفظ عنوان التوصيل بنجاح!",
    },
  };

  const content = t[language];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    area: "", // Added area to state
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
      !form.area ||
      !form.block ||
      !form.street ||
      !form.house
    ) {
      toast.error(content.errRequired);
      return;
    }

    // 1. Save data to Session Storage to pass it to the Payment Page
    // We use sessionStorage so it clears when the tab closes
    sessionStorage.setItem("shippingAddress", JSON.stringify(form));

    // 2. Set the fulfillment type to delivery
    sessionStorage.setItem("orderType", "delivery");

    toast.success(content.successMsg);
    router.push("/payment");
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-gray-50 dark:bg-transparent px-2 py-4 md:p-4">
      <Card className="w-full max-w-2xl shadow-md rounded-xl md:rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>{content.desc}</CardDescription>
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
                  <Label htmlFor="name" className="mb-2 block text-start">
                    {content.name}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="phone" className="mb-2 block text-start">
                    {content.phone}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="text-start"
                    dir="ltr"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="mb-2 block text-start">
                    {content.email}
                  </Label>
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

              {/* AREA DROPDOWN (Added here) */}
              <div className="mb-2">
                <Label htmlFor="area" className="mb-2 block text-start">
                  {content.area}
                </Label>
                <Select
                  value={form.area}
                  onValueChange={(value) => setForm({ ...form, area: value })}
                >
                  <SelectTrigger className="w-full text-start">
                    <SelectValue placeholder={content.areaPlace} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {kuwaitLocations.map((gov) => (
                      <SelectGroup key={gov.en}>
                        <SelectLabel className="bg-gray-100 dark:bg-gray-800 sticky top-[-5px] z-10 font-bold px-2 py-1.5">
                          {language === "ar" ? gov.ar : gov.en}
                        </SelectLabel>
                        {gov.areas.map((area) => (
                          <SelectItem
                            key={area.en}
                            value={area.en}
                            className="cursor-pointer pl-6"
                          >
                            {language === "ar" ? area.ar : area.en}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rest of the address fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-2">
                  <Label htmlFor="block" className="mb-2 block text-start">
                    {content.block}
                  </Label>
                  <Input
                    id="block"
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="street" className="mb-2 block text-start">
                    {content.street}
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="house" className="mb-2 block text-start">
                    {content.house}
                  </Label>
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
                <Label htmlFor="avenue" className="mb-2 block text-start">
                  {content.avenue}
                </Label>
                <Input
                  id="avenue"
                  name="avenue"
                  value={form.avenue}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-2">
                <Label
                  htmlFor="specialDirections"
                  className="mb-2 block text-start"
                >
                  {content.directions}
                </Label>
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
