import {
  Box,
  Checkbox,
  Chip,
  Typography,
} from "@mui/material";
import { Users } from "interfaces/Admin";

export default function UserLine({ user, onToggleRequest }: { user: Users, onToggleRequest: (user: Users) => void }) {
    return (
        <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "grey.100",
            "&:last-of-type": { borderBottom: "none" },
            "&:hover": { bgcolor: "grey.50" },
        }}
        >
        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
            sx={{
                fontSize: 14,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
            >
            {user.firstName} {user.lastName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            CIP : {user.cip}
            </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            <Chip
            label={user.enabled ? "Actif" : "Désactivé"}
            size="small"
            sx={{
                fontSize: 11,
                fontWeight: 600,
                bgcolor: user.enabled ? "success.50" : "error.50",
                color: user.enabled ? "success.main" : "error.main",
            }}
            />
            <Checkbox
            role="enable-checkbox"
            checked={user.enabled}
            onChange={() => onToggleRequest(user)}
            size="small"
            />
        </Box>
        </Box>
    );
}