"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getCookie } from "cookies-next";
import TranslateLoader from "./TranslateLoader";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function GoogleTranslate() {
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const langCookie = getCookie("googtrans");

    if (langCookie && langCookie !== "/en/en") {
      setIsTranslating(true);
    }

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ar",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const htmlClass = document.documentElement.className;

          if (htmlClass.includes("translated-")) {
            setTimeout(() => {
              setIsTranslating(false);
            }, 500);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Show Loader if translating */}
      {isTranslating && <TranslateLoader />}

      {/* Hidden div for Google Scripts */}
      <div
        id="google_translate_element"
        style={{ display: "none", visibility: "hidden" }}
      ></div>

      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
