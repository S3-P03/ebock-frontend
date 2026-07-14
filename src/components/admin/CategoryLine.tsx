import {
  Box,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CategoryInfo } from "interfaces/Category";

interface CategoryLineProps {
  category: CategoryInfo;
  onEdit: (category: CategoryInfo) => void;
  onDelete: (category: CategoryInfo) => void;
  showParent?: boolean;
}

export default function CategoryLine({
  category,
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
            {category.name}
            </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {showParent && (
                <Chip
                label={
                    category.parentCategory === null
                    ? "Catégorie"
                    : "Sous-catégorie"
                }
                size="small"
                sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor:
                    category.parentCategory === null
                        ? "primary.50"
                        : "secondary.50",
                    color:
                    category.parentCategory === null
                        ? "primary.main"
                        : "secondary.main",
                }}
                />
            )}

            <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(category)}
            >
            <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(category)}
            >
            <DeleteIcon fontSize="small" />
            </IconButton>
            
        </Box>
    </Box>
  );
}