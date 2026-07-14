import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState } from "react";

import useAuthSession from "hooks/useAuthSession";
import { CategoryInfo } from "interfaces/Category";

import {
  fetchCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchDeliveryOptionList,
  createDeliveryOption,
  updateDeliveryOption,
  deleteDeliveryOption,
  fetchTagList,
  createTag,
  updateTag,
  deleteTag,
} from "services/adminService";

import CategoryForm from "components/admin/CategoryForm";
import CategoryList from "components/admin/CategoryList";
import DeleteCategory from "components/admin/DeleteCategory";


export default function AdminTag() {

    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategoryInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadCategories = async () => {
        const data = await fetchTagList({token, logout});

        if (data) {
            setCategories(data);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = async (name: string, parentCategory: number | null) => {
        const success = await createTag({token,logout},{name, parentCategory});

        if (success) {
            await loadCategories();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string, parentCategory: number | null) => {
        const success = await updateTag({token, logout}, id, {name, parentCategory});

        if (success) {
            await loadCategories();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteTag({token, logout}, deleteTarget.categoryId);

        if (success) {
            await loadCategories();
            setDeleteTarget(null);
        }
    };

    const handleSave = (name: string, parentCategory: number | null) => {
        if (editingCategory) {
            handleUpdate(
                editingCategory.categoryId,
                name,
                parentCategory
            );
        } else {
            handleCreate(
                name,
                parentCategory
            );
        }
    };

    return (
        <Box>

        <Card sx={{p: 2, borderRadius: 2}}>
            <Button
                variant="contained"
                size="small"
                onClick={() => {
                    setEditingCategory(null);
                    setOpenForm(true);
                }}
            >
                Ajouter une catégorie
            </Button>

            <CategoryList
                categories={categories}
                onEdit={(category) => {
                    setEditingCategory(category);
                    setOpenForm(true);
                }}
                onDelete={(category) => {
                    setDeleteTarget(category);
                }}
                showParent={false}
            />

        </Card>

        {openForm && (
            <CategoryForm
                categories={categories}
                category={editingCategory}
                onSave={handleSave}
                onCancel={() => {
                    setEditingCategory(null);
                    setOpenForm(false);
                }}
                showParent={false}
            />
        )}

        {deleteTarget && (
            <DeleteCategory
                category={deleteTarget}
                hasChildren={categories.some(
                    c =>
                    c.parentCategory === deleteTarget.categoryId
                )}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        )}

        </Box>
    );
}