"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash, Pencil, X, Save } from "lucide-react";
import { Category } from "@/types/types";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

interface CategoriesTabProps {
  categories: Category[];
}

export default function CategoriesTab({ categories }: CategoriesTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Updated State for dual language
  const [formData, setFormData] = useState({ name: "", name_ar: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("English Name is required");
      return;
    }
    setLoading(true);

    const method = editingId ? "PUT" : "POST";
    const body = JSON.stringify({
      id: editingId,
      name: formData.name,
      name_ar: formData.name_ar, // Pass Arabic name
    });

    try {
      const res = await fetch("/api/admin/categories", { method, body });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Category updated!" : "Category added!");
        setFormData({ name: "", name_ar: "" });
        setEditingId(null);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error saving category");
    }
    setLoading(false);
  };

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setFormData({ 
      name: category.name, 
      name_ar: category.name_ar || "" 
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", name_ar: "" });
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        body: JSON.stringify({ id: categoryToDelete }),
      });
      if (res.ok) {
        toast.success("Category deleted");
        router.refresh();
        if (categoryToDelete === editingId) cancelEdit();
      }
    } catch (e) {
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        description="Are you sure? Deleting a category might affect products linked to it."
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Category" : "Add Category"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name (English)</Label>
              <Input
                placeholder="e.g. Burgers"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right w-full block">الاسم (Arabic)</Label>
              <Input
                dir="rtl"
                placeholder="مثال: برجر"
                value={formData.name_ar}
                onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
              />
            </div>

            <div className="flex gap-2 pt-2">
               <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                 {editingId ? "Update" : "Add"}
               </Button>
               {editingId && (
                <Button variant="ghost" onClick={cancelEdit} disabled={loading}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-3 border rounded-lg bg-card">
                <div className="flex flex-col">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-gray-500 font-arabic">{c.name_ar}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(c)} className="text-blue-500">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(c.id)} className="text-red-500">
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}