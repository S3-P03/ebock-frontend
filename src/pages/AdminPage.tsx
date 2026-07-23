import {
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import AdminUserPage from "../components/admin/AdminUserPage";
import AdminCategory from "../components/admin/AdminCategory";
import AdminDelivery from "../components/admin/AdminDelivery";
import AdminPayment from "../components/admin/AdminPayment";
import AdminTag from "../components/admin/AdminTag";
import AdminWear from "../components/admin/AdminWear";
import AdminBanItem from "../components/admin/AdminBanItem";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box sx={{ mx: "auto", px: 10, py: 10 }}>
        <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{ mb: 2 }}
        >
            <Tab
                label="Utilisateurs"
                sx={{
                    textTransform: "none",
                }}
            />
            <Tab
                label="Catégories"
                sx={{
                    textTransform: "none",
                }}
            />
            <Tab
                label="Paiement"
                sx={{
                    textTransform: "none",
                }}
            />
            <Tab
                label="Tags"
                sx={{
                    textTransform: "none",
                }}
            />
            <Tab
                label="Livraison"
                sx={{
                    textTransform: "none",
                }}
            />
            <Tab
                label="États"
                sx={{
                    textTransform: "none",
                }}
            />
            <Tab
                label="Items"
                sx={{
                    textTransform: "none",
                }}
            />
        </Tabs>
            {activeTab === 0 && <AdminUserPage />}
            {activeTab === 1 && <AdminCategory />}
            {activeTab === 2 && <AdminPayment />}
            {activeTab === 3 && <AdminTag />}
            {activeTab === 4 && <AdminDelivery />}
            {activeTab === 5 && <AdminWear />}
            {activeTab === 6 && <AdminBanItem />}

        </Box>
    );
}