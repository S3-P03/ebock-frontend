import {
  Box,
} from "@mui/material";
import { CategoryInfo } from "interfaces/Category";
import CategoryLine from "./CategoryLine";

interface CategoryListProps {
    categories: CategoryInfo[];
    onEdit: (category: CategoryInfo) => void;
    onDelete: (category: CategoryInfo) => void;
    showParent?: boolean;
}

export default function CategoryList({
    categories,
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
            <CategoryLine
                key={category.categoryId}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                showParent={showParent}
            />
        ))}
        </Box>
    );
}