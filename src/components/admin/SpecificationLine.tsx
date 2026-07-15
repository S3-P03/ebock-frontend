import {
  Box,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SpecificationInfo } from "interfaces/Specification";

interface CategoryLineProps {
  specification: SpecificationInfo;
  onEdit: (specification: SpecificationInfo) => void;
  onDelete: (specification: SpecificationInfo) => void;
  showParent?: boolean;
}

export default function SpecificationLine({
  specification,
  onEdit,
  onDelete,
  showParent,
}: CategoryLineProps) {
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
            {specification.name}
            </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {showParent && (
                <Chip
                label={
                    specification.parentSpecification === null
                    ? "Catégorie"
                    : "Sous-catégorie"
                }
                size="small"
                sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor:
                    specification.parentSpecification === null
                        ? "primary.50"
                        : "secondary.50",
                    color:
                    specification.parentSpecification === null
                        ? "primary.main"
                        : "secondary.main",
                }}
                />
            )}

            <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(specification)}
            >
            <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(specification)}
            >
            <DeleteIcon fontSize="small" />
            </IconButton>
            
        </Box>
    </Box>
  );
}