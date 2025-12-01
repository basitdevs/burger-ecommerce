"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Language = "en" | "ar";

interface LanguageContextProps {
  language: Language;
  switchLanguage: (lang: Language) => void;
  direction: "ltr" | "rtl";
  labels: Record<string, string>; // For static UI text like buttons
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Static translations for UI elements (Buttons, Headers, etc.)
const staticTranslations = {
  en: {
    addToCart: "Add to Cart",
    contactUs: "Contact Us",
    loading: "Loading...",
  },
  ar: {
    addToCart: "أضف إلى السلة",
    contactUs: "اتصل بنا",
    loading: "جار التحميل...",
  },
};

export const LanguageProvider = ({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Language;
}) => {
  const [language, setLanguage] = useState<Language>(initialLang);
  const router = useRouter();

  const switchLanguage = (lang: Language) => {
    Cookies.set("NEXT_LOCALE", lang, { expires: 365 }); // Save preference
    setLanguage(lang);
    router.refresh(); // Reloads Server Components with new data
  };

  const direction = language === "ar" ? "rtl" : "ltr";
  const labels = staticTranslations[language];

  // Update HTML tag dir attribute for Tailwind RTL support
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, direction, labels }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};