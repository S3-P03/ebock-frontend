import {
  Box, Button, Card, TextField, Typography,
} from "@mui/material";
import { UserAddress, UserInformation } from "../interfaces/User";
import { useState } from "react";

export default function UserInfo({ user, onSave }: { user: UserInformation, onSave: (firstName: string, lastName: string, address: UserAddress) => void }) {
  const [firstName, setFirstName] = useState(user?.user.firstName ?? "");
  const [lastName, setLastName] = useState(user?.user.lastName ?? "");
  const [civicNumber, setCivicNumber] = useState(String(user?.address.civicNumber ?? ""));
  const [street, setStreet] = useState(user?.address.street ?? "");
  const [city, setCity] = useState(user?.address.city ?? "");
  const [provinceCode, setProvinceCode] = useState(user?.address.provinceCode ?? "");
  const [country, setCountry] = useState(user?.address.country ?? "");
  const [postalCode, setPostalCode] = useState(user?.address.postalCode ?? "");

  const handleSave = () => {
    onSave(firstName, lastName, {
      civicNumber: Number(civicNumber),
      apptNumber: null,
      street,
      city,
      provinceCode,
      country,
      postalCode,
    });
  };

  return (
    <Card sx={{ p: 2.5, borderRadius: 2, width: "100%" }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
        Informations personnelles
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 1.5 }}>
        <TextField label="Prénom" size="small" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField label="Nom" size="small" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <TextField sx={{ "& .MuiInputBase-input": { color: "text.secondary" } }}
          label="Identifiant (CIP)" size="small" value={user?.user.cip || ""} disabled />
        <TextField sx={{ "& .MuiInputBase-input": { color: "text.secondary" } }}
          label="Courriel UdeS" size="small" value={user?.user.email || ""} disabled />
        <Box sx={{ 
          gridColumn: "1 / -1",
          border: "1px solid", 
          borderColor: "divider", 
          borderRadius: 2, 
          p: 2,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5
        }}>
          <Typography sx={{ gridColumn: "1 / -1", fontWeight: 600, fontSize: 14, mb: 0.5 }}>
            Adresse
          </Typography>
          <TextField label="Numéro civique" size="small" value={civicNumber} onChange={(e) => setCivicNumber(e.target.value)} />
          <TextField label="Rue" size="small" value={street} onChange={(e) => setStreet(e.target.value)} />
          <TextField label="Ville" size="small" value={city} onChange={(e) => setCity(e.target.value)} />
          <TextField label="Province" size="small" value={provinceCode} onChange={(e) => setProvinceCode(e.target.value)} />
          <TextField label="Pays" size="small" value={country} onChange={(e) => setCountry(e.target.value)} />
          <TextField label="Code postal" size="small" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </Box>
      </Box>
      <Button
        variant="contained"
        size="small"
        sx={{ borderRadius: 2, textTransform: "none" }}
        onClick={handleSave}
      >
        Enregistrer
      </Button>
    </Card>
  );
}