import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

import useAuthSession from "hooks/useAuthSession";
import { SpecificationInfo } from "interfaces/Specification";

import {
  fetchTagList,
  createTag,
  updateTag,
  deleteTag,
} from "services/tagService";

import SpecificationForm from "components/admin/SpecificationForm";
import SpecificationList from "components/admin/SpecificationList";
import DeleteSpecification from "components/admin/DeleteSpecification";


export default function AdminTag() {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [tags, setTags] = useState<SpecificationInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingTags, setEditingTags] = useState<SpecificationInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SpecificationInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadTags = async () => {
        const data = await fetchTagList({token, logout});

        if (data) {
            setTags(data);
        }
    };

    useEffect(() => {
        loadTags();
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

    const handleCreate = async (name: string) => {
        const success = await createTag({token,logout},{name});

        if (success) {
            await loadTags();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string) => {
        const success = await updateTag({token, logout}, id, {name});

        if (success) {
            await loadTags();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteTag({token, logout}, deleteTarget.specificationId);

        if (success) {
            await loadTags();
            setDeleteTarget(null);
        }
    };

    const handleSave = (name: string) => {
        if (editingTags) {
            handleUpdate(
                editingTags.specificationId,
                name
            );
        } else {
            handleCreate(
                name
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
                    setEditingTags(null);
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
            >
                Ajouter un tag
            </Button>

            <SpecificationList
                specifications={tags}
                onEdit={(specification) => {
                    setEditingTags(specification);
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
                onDelete={(specification) => {
                    setDeleteTarget(specification);
                }}
                showParent={false}
            />

        </Card>

        {openForm && (
            <Box ref={formRef}>
                <SpecificationForm
                    categories={tags}
                    category={editingTags}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingTags(null);
                        setOpenForm(false);
                    }}
                    showParent={false}
                />
            </Box>
        )}

        {deleteTarget && (
            <DeleteSpecification
                specification={deleteTarget}
                hasChildren={false}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        )}

        </Box>
    );
}