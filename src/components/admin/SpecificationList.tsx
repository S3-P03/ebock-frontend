import {
  Box,
} from "@mui/material";
import { SpecificationInfo } from "interfaces/Specification";
import SpecificationLine from "./SpecificationLine";

interface CategoryListProps {
    specifications: SpecificationInfo[];
    onEdit: (category: SpecificationInfo) => void;
    onDelete: (category: SpecificationInfo) => void;
    showParent?: boolean;
}

export default function SpecificationList({
    specifications: categories,
    onEdit,
    onDelete,
    showParent,
}: CategoryListProps) {
    const categoriesArray = Array.isArray(categories) ? categories : [];

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
        {categoriesArray.map((category) => (
            <SpecificationLine
                key={category.specificationId}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                showParent={showParent}
            />
        ))}
        </Box>
    );
}