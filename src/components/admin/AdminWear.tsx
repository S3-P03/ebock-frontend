import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

import useAuthSession from "hooks/useAuthSession";
import { SpecificationInfo } from "interfaces/Specification";

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
    const [wear, setWear] = useState<SpecificationInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingWear, setEditingWear] = useState<SpecificationInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SpecificationInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadWear = async () => {
        const data = await fetchWearList({token, logout});

        if (data) {
            setWear(data);
        }
    };

    useEffect(() => {
        loadWear();
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
        const success = await createWear({token,logout},{name});

        if (success) {
            await loadWear();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string) => {
        const success = await updateWear({token, logout}, id, {name});

        if (success) {
            await loadWear();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteWear({token, logout}, deleteTarget.specificationId);

        if (success) {
            await loadWear();
            setDeleteTarget(null);
        }
    };

    const handleSave = (name: string) => {
        if (editingWear) {
            handleUpdate(
                editingWear.specificationId,
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
                    setEditingWear(null);
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
            >
                Ajouter un état
            </Button>

            <SpecificationList
                specifications={wear}
                onEdit={(specification) => {
                    setEditingWear(specification);
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
        <Box ref={formRef}>
            {openForm && (
                <SpecificationForm
                    categories={wear}
                    category={editingWear}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingWear(null);
                        setOpenForm(false);
                    }}
                    showParent={false}
                />
            )}
        </Box>

        {deleteTarget && (
            <DeleteSpecification
                specification={deleteTarget}
                hasChildren={wear.some(
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