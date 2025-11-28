"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash, Plus } from "lucide-react";
import Image from "next/image";
import { Product, Category } from "@/types/types";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsTab({ products, categories }: ProductsTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State for Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [newProduct, setNewProduct] = useState({
    Title: "",
    price: "",
    image: "",
    categoryId: "",
  });

  const addProduct = async () => {
    if (!newProduct.Title || !newProduct.price || !newProduct.categoryId) {
      toast.error("Please fill Title, Price and Category");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product added!");
        setNewProduct({ Title: "", price: "", image: "", categoryId: "" });
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error adding product");
    }
    setLoading(false);
  };

  // Open the modal instead of window.confirm
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // The actual delete logic called by the modal
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        body: JSON.stringify({ id: productToDelete }),
      });
      if (res.ok) {
        toast.success("Product deleted");
        router.refresh();
      }
    } catch (e) {
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Title</Label>
              <Input
                value={newProduct.Title}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, Title: e.target.value })
                }
                placeholder="Burger"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Price (KWD)</Label>
              <Input
                type="number"
                step="0.001"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="1.500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Image URL</Label>
              <Input
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newProduct.categoryId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, categoryId: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={addProduct} disabled={loading} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.Title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold">{p.Title}</p>
                      <p className="text-sm text-primary font-bold">
                        {p.price.toFixed(3)} KWD
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(p.id)} // Open Modal
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No products found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}