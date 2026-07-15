import {
  Box, Card, CardActionArea, CardContent, IconButton,
} from "@mui/material";
import { DetailedItem } from "interfaces/Item";



export default function ConfirmCard({ item }: { item: DetailedItem }) {
  const { name, price, description } = item;

  return (
    <Card sx={{ borderRadius: 2, position: "relative", flex: "1 1 250px", maxWidth: "350px" }}>
      <CardActionArea>
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box sx={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name}
          </Box>
          <Box sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>
            {description}
          </Box>
          <Box sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>
            {price === 0 ? "Gratuit" : `${price} $`}
          </Box>
          <Box sx={{ fontSize: 12, color: "text.secondary" }}>Sherbrooke</Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}