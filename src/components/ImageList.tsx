import { Box } from "@mui/material";
import { ItemImage } from "../interfaces/Item";
import { useState } from "react";

export default function ImageList({images}: {images: ItemImage[]}) {

    const [currentPosition, setCurrentPosition] = useState(0);

    return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, alignItems: "center" }}>
        <img src={images[currentPosition].guid} alt="Item" style={{ width: "100%", borderRadius: 8 }} />
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            {images
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((img) => (
                <Box key={img.guid} sx={{ width: 100, height: 100, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
                    <img onClick={() => setCurrentPosition(img.displayOrder-1)} src={img.guid} alt="Item" style={{ width: "100%", height: "100%", objectFit: "fill" }} />
                </Box>
            ))}
        </Box>
    </Box>
    );
}