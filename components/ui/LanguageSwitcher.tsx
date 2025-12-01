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
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { language, switchLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-9 w-9 opacity-50"
      >
        <Globe className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

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
        {/* English Option */}
        <DropdownMenuItem
          onClick={() => switchLanguage("en")}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between w-full min-w-[100px]">
            <span>English</span>
            {language === "en" && (
              <Check className="h-4 w-4 ms-2 text-green-600" />
            )}
          </div>
        </DropdownMenuItem>

        {/* Arabic Option */}
        <DropdownMenuItem
          onClick={() => switchLanguage("ar")}
          className="cursor-pointer font-sans"
        >
          <div className="flex items-center justify-between w-full min-w-[100px]">
            <span>العربية</span>
            {language === "ar" && (
              <Check className="h-4 w-4 ms-2 text-green-600" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
