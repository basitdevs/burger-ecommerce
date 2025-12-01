"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

const NavBar = () => {
  const { setTheme } = useTheme();
  const { cartQty } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const { language } = useLanguage();

  const t = {
    en: {
      brand: "Burger King",
      light: "Light",
      dark: "Dark",
      system: "System",
      profile: "Profile",
      settings: "Settings",
      logout: "Log Out",
      login: "Login",
      toggleTheme: "Toggle theme",
    },
    ar: {
      brand: "برجر كنج",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل خروج",
      login: "دخول",
      toggleTheme: "تبديل المظهر",
    },
  };

  const content = t[language];

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md overflow-x-hidden">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {/* Brand Name */}
          <Link
            href="/"
            className="text-xl font-bold text-primary whitespace-nowrap"
          >
            {content.brand}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{content.toggleTheme}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {content.light}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {content.dark}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {content.system}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CUSTOM LANGUAGE SWITCHER */}
          <LanguageSwitcher />

          {/* Cart Button */}
          <div className="relative">
            <Link href="/cart">
              <Button
                variant="outline"
                className="rounded-full whitespace-nowrap flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartQty > 0 && (
                  <span className="absolute -top-1 -end-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartQty}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Login / User Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1 text-start">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  {/* me-2 (Margin End) puts space between icon and text correctly in RTL/LTR */}
                  <User className="me-2 h-4 w-4" /> {content.profile}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="me-2 h-4 w-4" /> {content.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="me-2 h-4 w-4" />
                  <span>{content.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="rounded-full whitespace-nowrap px-6">
                {content.login}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
