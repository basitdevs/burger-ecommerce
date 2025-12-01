"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Context

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // 2. Get Language
  const { language } = useLanguage();

  // 3. Define Translations
  const t = {
    en: {
      title: "Choose a New Password",
      desc: "Enter a new password for your account below.",
      labelPass: "New Password",
      labelConfirm: "Confirm New Password",
      btnReset: "Reset Password",
      btnResetting: "Resetting...",
      errorTitle: "Error",
      invalidLink: "Invalid or expired password reset link.",
      errLength: "Password must be at least 6 characters long.",
      errMatch: "Passwords do not match.",
      successMsg: "Your password has been reset! Redirecting...",
      genericError: "Something went wrong ❌"
    },
    ar: {
      title: "تعيين كلمة مرور جديدة",
      desc: "أدخل كلمة مرور جديدة لحسابك أدناه.",
      labelPass: "كلمة المرور الجديدة",
      labelConfirm: "تأكيد كلمة المرور",
      btnReset: "تعيين كلمة المرور",
      btnResetting: "جاري التعيين...",
      errorTitle: "خطأ",
      invalidLink: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية.",
      errLength: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
      errMatch: "كلمتا المرور غير متطابقتين.",
      successMsg: "تم تغيير كلمة المرور بنجاح! جاري تحويلك...",
      genericError: "حدث خطأ ما ❌"
    }
  };

  const content = t[language];

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate Token on Mount
  useEffect(() => {
    if (!token) setError(content.invalidLink);
  }, [token, content.invalidLink]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validation using dynamic strings
    if (password.length < 6) {
      setError(content.errLength);
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(content.errMatch);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || content.genericError);

      setSuccess(content.successMsg);
      toast.success(content.successMsg);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : content.genericError;
      toast.error(message);
      // Optional: Set form error if you want it visible on the card
      // setError(message); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error View (Invalid Token)
  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600">{content.errorTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              {error || content.invalidLink}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Form View
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-140px)] bg-gray-50 dark:bg-[#0a0a0a] p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>
            {content.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-start block">{content.labelPass}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-start block">{content.labelConfirm}</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

            <Button type="submit" disabled={isSubmitting || !!success} className="w-full">
              {isSubmitting ? content.btnResetting : content.btnReset}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}