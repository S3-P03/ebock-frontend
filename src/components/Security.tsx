import {
  Box, Button, Card, TextField, Typography,
} from "@mui/material";
import { useState } from "react";

export default function Security({ onSave, errorMessage }: { onSave: (currentPassword: string, newPassword: string) => void; errorMessage: string | null}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    await onSave(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
  };

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
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={!!errorMessage}
        />
        <TextField
          label="Nouveau mot de passe"
          type="password"
          size="small"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Box>
      {errorMessage && (
        <Typography color="error" sx={{ fontSize: 13, mb: 1 }}>
          {errorMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        size="small"
        sx={{ borderRadius: 2, textTransform: "none" }}
        onClick={handleSubmit}
      >
        Changer le mot de passe
      </Button>
    </Card>
  );
}