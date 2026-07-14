import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { fetchUserList, enableUser, disableUser } from "services/adminService";
import { Users } from "interfaces/Admin";
import UserList from "components/admin/UserList";
import ConfirmDialog from "components/admin/ConfirmDialog";
import useAuthSession from "hooks/useAuthSession";
import CenteredCircularProgress from "components/CenteredCircularProgress";

export default function AdminUserPage() {
  const [users, setUsers] = useState<Users[] | null>(null);
  const [pendingUser, setPendingUser] = useState<Users | null>(null);

  const { token, logout } = useAuthSession();


  const loadUsers = async () => {
    const data = await fetchUserList({
      token,
      logout,
    });

    setUsers(data);
  };


  useEffect(() => {
    loadUsers();
  }, []);


  const handleConfirm = async (user: Users) => {
    await (user.enabled
      ? disableUser(
          { token, logout },
          user.cip,
          { enabled: false }
        )
      : enableUser(
          { token, logout },
          user.cip,
          { enabled: true }
        ));

    await loadUsers();

    setPendingUser(null);
  };


  if (!users) {
    return <CenteredCircularProgress />;
  }


  return (
    <>
      <Card sx={{ borderRadius: 2 }}>
        <UserList
          users={users}
          onToggleRequest={setPendingUser}
        />
      </Card>


      {pendingUser && (
        <ConfirmDialog
          user={pendingUser}
          onConfirm={handleConfirm}
          onCancel={() => setPendingUser(null)}
        />
      )}
    </>
  );
}