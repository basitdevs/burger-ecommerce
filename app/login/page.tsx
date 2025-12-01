"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Context

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  // 2. Get Language
  const { language } = useLanguage();

  // 3. Define Translations
  const t = {
    en: {
      title: "Login",
      desc: "Enter your credentials to continue",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot Password?",
      btnSubmit: "Login",
      btnLoading: "Signing in...",
      noAccount: "Don't have an account?",
      signup: "Sign up",
      welcome: "Welcome back",
      loginFailed: "Login failed ❌",
      genericError: "Something went wrong ❌"
    },
    ar: {
      title: "تسجيل الدخول",
      desc: "أدخل بياناتك للمتابعة",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      btnSubmit: "دخول",
      btnLoading: "جاري الدخول...",
      noAccount: "ليس لديك حساب؟",
      signup: "إنشاء حساب",
      welcome: "مرحباً بعودتك",
      loginFailed: "فشل تسجيل الدخول ❌",
      genericError: "حدث خطأ ما ❌"
    }
  };

  const content = t[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        // Localized Welcome Message
        toast.success(`${content.welcome}, ${data.user.name} 🎉`);
        login(data.user);
      } else {
        toast.error(data.message || content.loginFailed);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : content.genericError;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>{content.desc}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="mb-3">
              <Label htmlFor="email" className="mb-2 block text-start">
                {content.emailLabel}
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder={content.emailPlaceholder}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password">{content.passwordLabel}</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {content.forgotPassword}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder={content.passwordPlaceholder}
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? content.btnLoading : content.btnSubmit}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              {content.noAccount}{" "}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline"
              >
                {content.signup}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}