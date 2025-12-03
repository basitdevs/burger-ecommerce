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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  ShoppingCart,
  Menu,
  Laptop,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

const NavBar = () => {
  const { setTheme } = useTheme();
  const { cartQty } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      menu: "Menu",
      language: "Language",
      appearance: "Appearance",
      account: "Account",
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
      menu: "القائمة",
      language: "اللغة",
      appearance: "المظهر",
      account: "الحساب",
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

  const ThemeToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{content.toggleTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="me-2 h-4 w-4" /> {content.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="me-2 h-4 w-4" /> {content.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="me-2 h-4 w-4" /> {content.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1 text-start">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
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
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity"
          >
            {content.brand}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />{" "}
          <LanguageSwitcher />
          <Link href="/cart">
            <Button
              variant="outline"
              className="rounded-full  relative group hover:border-primary transition-colors"
            >
              <ShoppingCart className="h-4 w-4  group-hover:text-primary transition-colors" />
              {cartQty > 0 && (
                <span className="absolute -top-1.5 -end-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-950">
                  {cartQty}
                </span>
              )}
            </Button>
          </Link>
          {isAuthenticated && user ? (
            <ProfileDropdown />
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-6">{content.login}</Button>
            </Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartQty > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartQty}
                </span>
              )}
            </Button>
          </Link>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
                <span className="sr-only">{content.menu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={language === "ar" ? "right" : "left"}
              className="max-w-[300px] w-full sm:max-w-[350px] px-3"
            >
              <SheetHeader className="text-start border-b pb-4 mb-4">
                <SheetTitle className="text-base font-bold text-primary">
                  {content.brand}
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6">
                {isAuthenticated && user ? (
                  <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-2">
                  <p className="text-sm font-medium text-muted-foreground px-2">
                    {content.account}
                  </p>
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start h-10 w-full"
                      >
                        <User className="me-2 h-4 w-4" /> {content.profile}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start h-10 w-full"
                      >
                        <Settings className="me-2 h-4 w-4" /> {content.settings}
                      </Button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full justify-center">
                        {content.login}
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="h-px bg-border" />

                <div className="grid gap-4">
                  <p className="text-sm font-medium text-muted-foreground px-2">
                    {content.appearance}
                  </p>

                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm">{content.toggleTheme}</span>
                    <ThemeToggle />
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm">{content.language}</span>
                    <div className="scale-90 origin-right rtl:origin-left">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="mt-auto pt-4 border-t">
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      {content.logout}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
