"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash } from "lucide-react";
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

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const addCategory = async () => {
    if (!newCatName) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCatName }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category added!");
        setNewCatName("");
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error adding category");
    }
    setLoading(false);
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
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Input
              placeholder="Category Name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <Button onClick={addCategory} disabled={loading}>
              Add
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(c.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}