import {
  Box, Tabs, Tab, Card,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUserList, enableUser, disableUser } from "../services/adminService";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { Users } from "interfaces/Admin";
import UserList from "components/admin/UserList";
import ConfirmDialog from "components/admin/ConfirmDialog";
import useAuthSession from "hooks/useAuthSession";
import { fetchUser } from "services/userService";
import { User } from "interfaces/User";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [pendingUser, setPendingUser] = useState<Users | null>(null);
    const [users, setUsers] = useState<Users[] | null>(null);

    const { isAuthenticated, token, logout } = useAuthSession();
    const [me, setMe] = useState<User | null>(null);
    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        try {
            fetchUser({ token, logout }).then((data) => {
                setMe(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
    }, [isAuthenticated]);
    const cip = me?.cip;
    
    useEffect(() => {
        try {
            if (cip) {
                fetchUserList({token, logout}).then((data) => {
                    setUsers(data);
                });
            } 
        } catch (error) {
            console.error("Erreur lors de la récupération de la liste des utilisateurs :", error);
        }
    }, [cip]);

    const handleToggleRequest = (user: Users) => setPendingUser(user);

    const handleConfirm = async (user: Users) => {
        const updated = user.enabled
        ? await disableUser(user.cip, { enabled: false })
        : await enableUser(user.cip, { enabled: true });

        if (updated) {
            setUsers((currentUsers) => {
            if (!currentUsers) return currentUsers;
            return currentUsers.map((u) => (u.cip === updated.cip ? updated : u));
            });
        }
        setPendingUser(null);
    };

    const handleCancel = () => setPendingUser(null);

    if (users == null) return <CenteredCircularProgress />;

    return (
        <Box sx={{ mx: "auto", px: 10, py: 10 }}>
        <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{ mb: 1.5, minHeight: 40 }}
        >
            <Tab
            label="Utilisateurs"
            sx={{ minHeight: 40, fontSize: 14, textTransform: "none" }}
            />
        </Tabs>

        {activeTab === 0 && (
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                <UserList users={users} onToggleRequest={handleToggleRequest} />
            </Card>
        )}

        {pendingUser && (
            <ConfirmDialog
                user={pendingUser}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
            )}
        </Box>
    );
}