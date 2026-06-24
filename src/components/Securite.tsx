import {
  Box, Button, Card, TextField, Typography,
} from "@mui/material";
import { UserSecurity } from "../interfaces/User";

export default function Securite({ user }: { user: UserSecurity | null }) {

  return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
        Sécurité
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 1.5 }}>
        <TextField
          label="Mot de passe actuel"
          type="password"
          size="small"
          value={user?.currentPassword || ""}
        />
        <TextField
          label="Nouveau mot de passe"
          type="password"
          size="small"
          value={user?.newPassword || ""}
        />
      </Box>

      <Button
        variant="contained"
        size="small"
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Changer le mot de passe
      </Button>
    </Card>
  );
}