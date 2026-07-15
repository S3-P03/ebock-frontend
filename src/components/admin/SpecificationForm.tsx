import {
  Box,
  Button,
  Card,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SpecificationInfo } from "interfaces/Specification";

export default function SpecificationForm({
  categories,
  category,
  onSave,
  onCancel,
  showParent,
}: {
  categories: SpecificationInfo[];
  category: SpecificationInfo | null;
  onSave: (name: string, parentId: number | null) => void;
  onCancel: () => void;
  showParent?: boolean;
}) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);

  const handleSave = () => {
    onSave(name, parentId);
    setName("");
    setParentId(null);
  };

  useEffect(() => {
  if (category) {
    setName(category.name);
    setParentId(category.parentSpecification);
  } else {
    setName("");
    setParentId(null);
  }
}, [category]);

  return (
    <Card sx={{ p: 2.5, borderRadius: 2, width: "100%" }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
        {category ? "Modifier une spécification" : "Créer une spécification"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          label="Nom de la spécification"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {showParent && (
          <TextField
            select
            label="Catégorie parente"
            size="small"
            value={parentId ?? ""}
            onChange={(e) =>
              setParentId(
                e.target.value
                  ? Number(e.target.value)
                  : null
              )
            }
          >
            <MenuItem value="">
              Aucune (racine)
            </MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category.specificationId}
                value={category.specificationId}
              >
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <Button
        variant="contained"
        size="small"
        sx={{
          borderRadius: 2,
          textTransform: "none",
        }}
        onClick={handleSave}
      >
        {category ? "Modifier" : "Créer"}
      </Button>
      <Button
        variant="outlined"
        size="small"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          ml: 1,
        }}
        onClick={onCancel}
      >
        Annuler
      </Button>
    </Card>
  );
}