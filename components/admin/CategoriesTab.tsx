"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash, Pencil, X } from "lucide-react"; // Added Pencil, X
import { Category } from "@/types/types";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal"; 

interface CategoriesTabProps {
  categories: Category[];
}

export default function CategoriesTab({ categories }: CategoriesTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  
  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!newCatName) return;
    setLoading(true);

    const method = editingId ? "PUT" : "POST";
    const body = editingId 
      ? JSON.stringify({ id: editingId, name: newCatName })
      : JSON.stringify({ name: newCatName });

    try {
      const res = await fetch("/api/admin/categories", {
        method,
        body,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Category updated!" : "Category added!");
        setNewCatName("");
        setEditingId(null); // Reset edit mode
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
    setNewCatName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewCatName("");
  };

  // Trigger Modal
  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Perform Delete
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
        // If we deleted the category being edited, reset edit mode
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
          <CardContent className="flex gap-3">
            <Input
              placeholder="Category Name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            {editingId && (
              <Button variant="ghost" onClick={cancelEdit} disabled={loading}>
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={loading}>
              {editingId ? "Update" : "Add"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="font-medium">{c.name}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(c)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(c.id)}
                    className="text-red-500 hover:text-red-700"
                  >
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