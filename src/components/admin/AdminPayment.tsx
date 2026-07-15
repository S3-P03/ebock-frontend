import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

import useAuthSession from "hooks/useAuthSession";
import { SpecificationInfo } from "interfaces/Specification";

import {
  fetchPaymentOptionList,
  createPaymentOption,
  updatePaymentOption,
  deletePaymentOption,
} from "services/paymentOptionService";

import SpecificationForm from "components/admin/SpecificationForm";
import SpecificationList from "components/admin/SpecificationList";
import DeleteSpecification from "components/admin/DeleteSpecification";


export default function AdminPayment() {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [paymentOptions, setPaymentOptions] = useState<SpecificationInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingPaymentOptions, setEditingPaymentOptions] = useState<SpecificationInfo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SpecificationInfo | null>(null);
    const { token, logout } = useAuthSession();

    const loadPaymentOptions = async () => {
        const data = await fetchPaymentOptionList({token, logout});

        if (data) {
            setPaymentOptions(data);
        }
    };

    useEffect(() => {
        loadPaymentOptions();
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
        const success = await createPaymentOption({token,logout},{name});

        if (success) {
            await loadPaymentOptions();
            setOpenForm(false);
        }
    };

    const handleUpdate = async (id: number, name: string) => {
        const success = await updatePaymentOption({token, logout}, id, {name});

        if (success) {
            await loadPaymentOptions();
            setOpenForm(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deletePaymentOption({token, logout}, deleteTarget.specificationId);

        if (success) {
            await loadPaymentOptions();
            setDeleteTarget(null);
        }
    };

    const handleSave = (name: string) => {
        if (editingPaymentOptions) {
            handleUpdate(
                editingPaymentOptions.specificationId,
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
                    setEditingPaymentOptions(null);
                    if (openForm) {
                        scrollToForm();
                    } else {
                        setOpenForm(true);
                    }
                }}
            >
                Ajouter une option de payment
            </Button>

            <SpecificationList
                specifications={paymentOptions}
                onEdit={(specification) => {
                    setEditingPaymentOptions(specification);
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
                    categories={paymentOptions}
                    category={editingPaymentOptions}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingPaymentOptions(null);
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