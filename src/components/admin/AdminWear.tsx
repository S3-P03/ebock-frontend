import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

import useAuthSession from "hooks/useAuthSession";
import { CategoryInfo } from "interfaces/Category";

import {
  fetchWearList,
  createWear,
  updateWear,
  deleteWear,
} from "services/wearService";

import SpecificationForm from "components/admin/SpecificationForm";
import SpecificationList from "components/admin/SpecificationList";
import DeleteSpecification from "components/admin/DeleteSpecification";


export default function AdminWear() {
    const formRef = useRef<HTMLDivElement | null>(null);    
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategoryInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadCategories = async () => {
        const data = await fetchWearList({token, logout});

        if (data) {
            setCategories(data);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (openForm) {
            setTimeout(() => {
                formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 0);
        }
    }, [openForm]);

    const handleCreate = async (name: string, parentCategory: number | null) => {
        const success = await createWear({token,logout},{name, parentCategory});

        if (success) {
            await loadCategories();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string, parentCategory: number | null) => {
        const success = await updateWear({token, logout}, id, {name, parentCategory});

        if (success) {
            await loadCategories();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteWear({token, logout}, deleteTarget.categoryId);

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

            <SpecificationList
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
            <Box ref={formRef}>
                <SpecificationForm
                    categories={categories}
                    category={editingCategory}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingCategory(null);
                        setOpenForm(false);
                    }}
                    showParent={false}
                />
            </Box>
        )}

        {deleteTarget && (
            <DeleteSpecification
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