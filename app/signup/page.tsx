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
} from "@/components/ui/select";
import { User, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [form, setForm] = useState({
    country: "Kuwait",
    mobile: "",
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("Response:", data);

      if (data.success) {
        toast.success("Account created successfully!");
        setForm({
          name: "",
          email: "",
          password: "",
          mobile: "",
          country: "Kuwait",
        });
        router.push("/login");
      } else {
        toast.error(data.message || "❌ Something went wrong.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "❌ Something went wrong.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>Fill the form to sign up</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Country */}
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={form.country}
                onValueChange={(value) => setForm({ ...form, country: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kuwait">Kuwait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex mt-2">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">
                  +965
                </span>
                <Input
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder="Enter Your Mobile Number"
                  className="rounded-l-none"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Your Name"
                  className="pl-9"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  className="pl-9"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Your Password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-5">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submiting..." : "Submit"}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              By registering you agree to our{" "}
              <Link
                href="/"
                className="text-primary font-medium hover:underline"
              >
                Terms & Conditions
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
