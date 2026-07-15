import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

import useAuthSession from "hooks/useAuthSession";
import { SpecificationInfo } from "interfaces/Specification";

import {
  fetchDeliveryOptionList,
  createDeliveryOption,
  updateDeliveryOption,
  deleteDeliveryOption,
} from "services/deliveryOptionService";

import SpecificationForm from "components/admin/SpecificationForm";
import SpecificationList from "components/admin/SpecificationList";
import DeleteSpecification from "components/admin/DeleteSpecification";


export default function AdminDelivery() {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [deliveryOptions, setDeliveryOptions] = useState<SpecificationInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingDeliveryOption, setEditingDeliveryOption] = useState<SpecificationInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SpecificationInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadDeliveryOptions = async () => {
        const data = await fetchDeliveryOptionList({token, logout});

        if (data) {
            setDeliveryOptions(data);
        }
    };

    useEffect(() => {
        loadDeliveryOptions();
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
        const success = await createDeliveryOption({token,logout},{name});

        if (success) {
            await loadDeliveryOptions();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string) => {
        const success = await updateDeliveryOption({token, logout}, id, {name});

        if (success) {
            await loadDeliveryOptions();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteDeliveryOption({token, logout}, deleteTarget.specificationId);
        if (success) {
            await loadDeliveryOptions();
            setDeleteTarget(null);
        }
    };

    const handleSave = (name: string) => {
        if (editingDeliveryOption) {
            handleUpdate(
                editingDeliveryOption.specificationId,
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
                    setEditingDeliveryOption(null);
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
            >
                Ajouter une option de livraison
            </Button>

            <SpecificationList
                specifications={deliveryOptions}
                onEdit={(specification) => {
                    setEditingDeliveryOption(specification);
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
                    categories={deliveryOptions}
                    category={editingDeliveryOption}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingDeliveryOption(null);
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