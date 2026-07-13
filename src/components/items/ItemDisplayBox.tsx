import ItemCard from "./ItemCard";
import {
  Box, Grid
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
    <Grid container spacing={2}>
      {itemsArray.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.itemId}>
            <ItemCard key={item.itemId} item={item} />
        </Grid>
      ))}
    </Grid>
    </Box> 
  );
}