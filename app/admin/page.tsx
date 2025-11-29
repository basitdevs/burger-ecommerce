import AdminClient from "@/components/admin/AdminClient";
import LogoutButton from "@/components/admin/LogoutButton";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { getCategories, getProducts, getRestaurantInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, categories, info] = await Promise.all([
    getProducts(),
    getCategories(),
    getRestaurantInfo(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className=" border-b bg-white dark:bg-[#111] dark:border-gray-800 w-full ">
        <div className="max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="p-6">
        <AdminClient
          initialProducts={products}
          initialCategories={categories}
          initialInfo={info}
        />
      </div>
    </div>
  );
}
