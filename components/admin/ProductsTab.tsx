"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash, Plus, Pencil, Save, X } from "lucide-react"; // Added icons
import Image from "next/image";
import { Product, Category } from "@/types/types";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsTab({
  products,
  categories,
}: ProductsTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    Title: "",
    price: "",
    image: "",
    categoryId: "",
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSave = async () => {
    if (!formData.Title || !formData.price || !formData.categoryId) {
      toast.error("Please fill Title, Price and Category");
      return;
    }
    setLoading(true);

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? JSON.stringify({ ...formData, id: editingId })
      : JSON.stringify(formData);

    try {
      const res = await fetch("/api/admin/products", {
        method,
        body,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Product updated!" : "Product added!");
        resetForm();
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error saving product");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ Title: "", price: "", image: "", categoryId: "" });
    setEditingId(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      Title: product.Title,
      price: product.price.toString(),
      image: product.image,
      categoryId: product.categoryId.toString(),
    });
    // Scroll to top to see form (optional but helpful on mobile)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

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
        if (productToDelete === editingId) resetForm();
      }
    } catch (e) {
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (!hydrated) return null;

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
        {/* Add/Edit Product Form */}
        <Card className="h-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </CardTitle>
            {editingId && (
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.Title}
                onChange={(e) =>
                  setFormData({ ...formData, Title: e.target.value })
                }
                placeholder="Burger"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Price (KWD)</Label>
              <Input
                type="number"
                step="0.001"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="1.500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
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
            <Button onClick={handleSave} disabled={loading} className="w-full">
              {editingId ? (
                <>
                  <Save className="w-4 h-4 mr-2" /> Update Product
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </>
              )}
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
                  className={`flex items-center justify-between p-3 border rounded-lg transition ${
                    editingId === p.id
                      ? "border-primary bg-primary/5"
                      : "bg-card hover:bg-muted/50"
                  }`}
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
                  <div className="flex flex-col-reverse md:flex-row gap-1 md:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(p)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(p.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
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
