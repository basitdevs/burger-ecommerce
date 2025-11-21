"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        toast.success("Reset link sent to your email! 📧");
      } else {
        toast.error(data.message || "Failed to process request ❌");
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center relative">
          <Link href="/login" className="absolute left-0 top-0 p-6 text-gray-500 hover:text-primary">
             <ArrowLeft className="w-5 h-5" />
          </Link>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {submitted 
              ? "Check your email for instructions." 
              : "Enter your email to receive a reset link."}
          </CardDescription>
        </CardHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4!">
              <div className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="text-center py-6">
             <div className="mb-4 text-green-600 bg-green-50 p-4 rounded-lg text-sm">
                We have sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and spam folder.
             </div>
             <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
                Try another email
             </Button>
             <div className="mt-4">
               <Link href="/login" className="text-primary font-medium hover:underline text-sm">
                 Back to Login
               </Link>
             </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}