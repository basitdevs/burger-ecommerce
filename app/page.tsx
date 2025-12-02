import AppCardFields from "@/components/ui/AppCardFields";
import { getProducts, getCategories, getRestaurantInfo } from "@/lib/db";

const HomePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const info = await getRestaurantInfo();

  return (
    <div className="grid grid-cols-1 gap-2 pb-8">
      <AppCardFields products={products} categories={categories} info={info} />
    </div>
  );
};

export default HomePage;
