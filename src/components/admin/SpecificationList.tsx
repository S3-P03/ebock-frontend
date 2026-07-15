import {
  Box,
} from "@mui/material";
import { SpecificationInfo } from "interfaces/Specification";
import SpecificationLine from "./SpecificationLine";

interface SpecificationListProps {
    specifications: SpecificationInfo[];
    onEdit: (specification: SpecificationInfo) => void;
    onDelete: (specification: SpecificationInfo) => void;
    showParent?: boolean;
}

export default function SpecificationList({
    specifications,
    onEdit,
    onDelete,
    showParent,
}: SpecificationListProps) {
    const specificationArray = Array.isArray(specifications) ? specifications : [];

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
        {specificationArray.map((specification) => (
            <SpecificationLine
                key={specification.specificationId}
                specification={specification}
                onEdit={onEdit}
                onDelete={onDelete}
                showParent={showParent}
            />
        ))}
        </Box>
    );
}