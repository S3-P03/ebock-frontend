import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, useRef} from "react";

import useAuthSession from "hooks/useAuthSession";
import { SpecificationInfo } from "interfaces/Specification";

import {
  fetchCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from "services/categoryService";

import SpecificationForm from "components/admin/SpecificationForm";
import SpecificationList from "components/admin/SpecificationList";
import DeleteSpecification from "components/admin/DeleteSpecification";


export default function AdminCategory() {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [categories, setCategories] = useState<SpecificationInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<SpecificationInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SpecificationInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadCategories = async () => {
        const data = await fetchCategoryList({token, logout});

        if (data) {
            setCategories(data);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const scrollToForm = () => {
        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 0);
    };
    useEffect(() => {
        if (openForm) {
            scrollToForm();
        }
    }, [openForm]);

    const handleCreate = async (name: string, parentCategory: number | null) => {
        const success = await createCategory({token,logout},{name, parentCategory});

        if (success) {
            await loadCategories();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string, parentCategory: number | null) => {
        const success = await updateCategory({token, logout}, id, {name, parentCategory});
        
        if (success) {
            await loadCategories();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteCategory({token, logout}, deleteTarget.specificationId);
        if (success) {
            await loadCategories();
            setDeleteTarget(null);
        }
    };

    const handleSave = (name: string, parentCategory: number | null) => {
        if (editingCategory) {
            handleUpdate(
                editingCategory.specificationId,
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
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
            >
                Ajouter une catégorie
            </Button>

            <SpecificationList
                specifications={categories}
                onEdit={(specification) => {
                    setEditingCategory(specification);
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
                onDelete={(specification) => {
                    setDeleteTarget(specification);
                }}
                showParent={true}
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
                    showParent={true}
                />
            </Box>
        )}

        {deleteTarget && (
            <DeleteSpecification
                specification={deleteTarget}
                hasChildren={categories.some(
                    c =>
                    c.parentSpecification === deleteTarget.specificationId
                )}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        )}

        </Box>
    );
}