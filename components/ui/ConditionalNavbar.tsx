"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar"; // Import your existing Navbar

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // If the path starts with "/admin", do not render the Navbar
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Navbar />;
}