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
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Context

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 2. Get Language
  const { language } = useLanguage();

  // 3. Define Translations
  const t = {
    en: {
      title: "Reset Password",
      descNormal: "Enter your email to receive a reset link.",
      descSent: "Check your email for instructions.",
      emailLabel: "Email Address",
      placeholder: "name@example.com",
      btnSend: "Send Reset Link",
      btnSending: "Sending...",
      successTitle: "Reset link sent to your email! 📧",
      errorTitle: "Failed to process request ❌",
      errorGeneric: "Something went wrong. Please try again later.",
      successBodyPre: "We have sent a password reset link to", // Text before email
      successBodyPost: "Please check your inbox and spam folder.", // Text after email
      tryAnother: "Try another email",
      backToLogin: "Back to Login",
    },
    ar: {
      title: "إعادة تعيين كلمة المرور",
      descNormal: "أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين.",
      descSent: "تحقق من بريدك الإلكتروني للحصول على التعليمات.",
      emailLabel: "البريد الإلكتروني",
      placeholder: "name@example.com",
      btnSend: "إرسال الرابط",
      btnSending: "جاري الإرسال...",
      successTitle: "تم إرسال الرابط إلى بريدك الإلكتروني! 📧",
      errorTitle: "فشل في معالجة الطلب ❌",
      errorGeneric: "حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.",
      successBodyPre: "لقد قمنا بإرسال رابط إعادة التعيين إلى",
      successBodyPost: "يرجى التحقق من البريد الوارد والرسائل غير المرغوب فيها.",
      tryAnother: "جرب بريد إلكتروني آخر",
      backToLogin: "العودة لتسجيل الدخول",
    },
  };

  const content = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success(content.successTitle);
      } else {
        toast.error(data.message || content.errorTitle);
      }
    } catch {
      toast.error(content.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center relative">
          {/* 
            'start-0' automatically handles LTR (Left) and RTL (Right).
            We rotate the icon in Arabic so the arrow points correctly for 'Back'.
          */}
          <Link
            href="/login"
            className="absolute start-0 top-0 p-6 text-gray-500 hover:text-primary"
          >
            <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
          
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>
            {submitted ? content.descSent : content.descNormal}
          </CardDescription>
        </CardHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="email">{content.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={content.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? content.btnSending : content.btnSend}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="text-center py-6">
            <div className="mb-4 text-green-600 bg-green-50 p-4 rounded-lg text-sm">
              {content.successBodyPre} <strong>{email}</strong>. <br/>
              {content.successBodyPost}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSubmitted(false)}
            >
              {content.tryAnother}
            </Button>
            <div className="mt-4">
              <Link
                href="/login"
                className="text-primary font-medium hover:underline text-sm"
              >
                {content.backToLogin}
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}