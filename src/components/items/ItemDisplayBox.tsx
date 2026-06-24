import ItemCard from "./ItemCard";
import {
  Box
} from "@mui/material";
import { SellerItem } from "interfaces/Item";

export default function ItemDisplayBox({ items }: { items: SellerItem[] }) {
  const itemsArray = Array.isArray(items) ? items : [items];
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {itemsArray.map((item) => (
      <ItemCard key={item.itemId} itemList={item} />
      ))}
    </Box> 
  );
}