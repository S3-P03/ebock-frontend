import {
  Box, Card, CardActionArea, CardContent, IconButton,
} from "@mui/material";
import { SellerItem } from "../interfaces/Seller";

export default function ItemCard({ itemList }: { itemList: SellerItem }) {
  const { name, price, location } = itemList;
  return (
    <Card sx={{ borderRadius: 2, position: "relative", flex: "1 1 30%", minWidth: 120 }}>
      <IconButton size="small" sx={{ position: "absolute", top: 6, right: 6, zIndex: 1 }}>
        ♡
      </IconButton>
      <CardActionArea>
        <Box sx={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100", fontSize: 48 }}>
        </Box>
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box sx={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</Box>
          <Box sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>{price} $</Box>
          <Box sx={{ fontSize: 12, color: "text.secondary" }}>{location}</Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}