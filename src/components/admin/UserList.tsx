import {
  Box,
} from "@mui/material";
import { Users } from "interfaces/Admin";
import UserLine from "./UserLine";

export default function UserList({ users, onToggleRequest }: { users: Users[], onToggleRequest: (user: Users) => void }) {
    const usersArray = Array.isArray(users) ? users : [];
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
        }}
        >
        {usersArray.map((user) => (
            <UserLine key={user.cip} user={user} onToggleRequest={onToggleRequest} />
        ))}
        </Box>
    );
}