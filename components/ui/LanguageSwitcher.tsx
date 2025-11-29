"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { getCookie, setCookie } from "cookies-next"; 

// Helper to handle cookies if you don't want to install 'cookies-next'
const setGoogleCookie = (value: string) => {
  // We set the cookie for the domain and path to ensure Google picks it up
  document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=${value}; path=/;`; // Fallback
};

const getGoogleCookie = () => {
  const match = document.cookie.match(new RegExp("(^| )googtrans=([^;]+)"));
  if (match) return match[2];
  return "/en/en"; // Default
};

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("/en/en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lang = getGoogleCookie();
    setCurrentLang(lang);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // Google Translate Cookie Format: /source_lang/target_lang
    const cookieValue = `/en/${langCode}`;
    
    setGoogleCookie(cookieValue);
    setCurrentLang(cookieValue);
    
    // Reload the page to apply translation
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 border-gray-200 dark:border-gray-800"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          <div className="flex items-center justify-between w-full">
            <span>English</span>
            {currentLang === "/en/en" && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
          <div className="flex items-center justify-between w-full">
            <span>Arabic</span>
            {currentLang === "/en/ar" && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}