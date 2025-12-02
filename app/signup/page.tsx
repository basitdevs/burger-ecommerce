"use client";

import { useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { User, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

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
    ],
  },
];

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { language } = useLanguage();

  const t = {
    en: {
      title: "Create an Account",
      desc: "Fill the form to sign up",
      area: "Area / Region",
      areaPlace: "Select your area",
      mobile: "Mobile Number",
      mobilePlace: "Enter Your Mobile Number",
      name: "Name",
      namePlace: "Enter Your Name",
      email: "Email",
      emailPlace: "Enter Your Email",
      password: "Password",
      passwordPlace: "Enter Your Password",
      submit: "Submit",
      submitting: "Submitting...",
      termsText: "By registering you agree to our",
      termsLink: "Terms & Conditions",
      success: "Account created successfully!",
      errorGeneric: "Something went wrong ❌",
    },
    ar: {
      title: "إنشاء حساب جديد",
      desc: "يرجى ملء النموذج للتسجيل",
      area: "المنطقة",
      areaPlace: "اختر منطقتك",
      mobile: "رقم الهاتف",
      mobilePlace: "أدخل رقم الهاتف",
      name: "الاسم",
      namePlace: "أدخل اسمك",
      email: "البريد الإلكتروني",
      emailPlace: "أدخل البريد الإلكتروني",
      password: "كلمة المرور",
      passwordPlace: "أدخل كلمة المرور",
      submit: "تسجيل",
      submitting: "جاري التسجيل...",
      termsText: "بالتسجيل أنت توافق على",
      termsLink: "الشروط والأحكام",
      success: "تم إنشاء الحساب بنجاح!",
      errorGeneric: "حدث خطأ ما ❌",
    },
  };

  const content = t[language as keyof typeof t];

  const [form, setForm] = useState({
    area: "",
    mobile: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(content.success);
        setForm({
          name: "",
          email: "",
          password: "",
          mobile: "",
          area: "",
        });
        router.push("/login");
      } else {
        toast.error(data.message || content.errorGeneric);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : content.errorGeneric;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>{content.desc}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* AREA SELECTION */}
            <div>
              <Label htmlFor="area" className="block text-start">
                {content.area}
              </Label>
              <Select
                value={form.area}
                onValueChange={(value) => setForm({ ...form, area: value })}
              >
                <SelectTrigger className="mt-2 text-start">
                  <SelectValue placeholder={content.areaPlace} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {kuwaitLocations.map((gov) => (
                    <SelectGroup key={gov.en}>
                      <SelectLabel className="bg-gray-200 z-[99] dark:bg-gray-800 sticky top-[-6px]">
                        {language === "ar" ? gov.ar : gov.en}
                      </SelectLabel>
                      {gov.areas.map((area) => (
                        <SelectItem
                          key={area.en}
                          value={area.en}
                          className="cursor-pointer"
                        >
                          {language === "ar" ? area.ar : area.en}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobile" className="block text-start">
                {content.mobile}
              </Label>
              <div className="flex mt-2" dir="ltr">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">
                  +965
                </span>
                <Input
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder={content.mobilePlace}
                  className="rounded-l-none"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="block text-start">
                {content.name}
              </Label>
              <div className="relative mt-2">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={content.namePlace}
                  className="ps-9"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block text-start">
                {content.email}
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={content.emailPlace}
                  className="ps-9"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="block text-start">
                {content.password}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={content.passwordPlace}
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-5">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? content.submitting : content.submit}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              {content.termsText}{" "}
              <Link
                href="/"
                className="text-primary font-medium hover:underline"
              >
                {content.termsLink}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
