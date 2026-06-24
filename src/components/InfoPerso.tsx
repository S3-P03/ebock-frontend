import {
  Box, Button, Card, TextField, Typography,
} from "@mui/material";
import { UserInfoPerso } from "../interfaces/User";

export default function InformationsPersonnelles({ user }: { user: UserInfoPerso }) {
  return (
    <Card sx={{ p: 2.5, borderRadius: 2, width: "100%" }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
        Informations personnelles
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 1.5 }}>
        <TextField label="Prénom" size="small" value={user?.user.firstName || ""} />
        <TextField label="Nom" size="small" value={user?.user.lastName || ""} />
        <TextField sx={{ "& .MuiInputBase-input": { color: "text.secondary" } }}
          label="Identifiant (CIP)" size="small" value={user?.user.cip || ""} disabled/>
        <TextField sx={{ "& .MuiInputBase-input": { color: "text.secondary" } }}
          label="Courriel UdeS" size="small" value={user?.user.email || ""} disabled/>
        <TextField label="Adresse" size="small" value={user?.address || ""}
          sx={{ gridColumn: "1 / -1" }}
        />
      </Box>

      <Button
        variant="contained"
        size="small"
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Enregistrer
      </Button>
    </Card>
  );
}