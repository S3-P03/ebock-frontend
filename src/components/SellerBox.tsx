import {
  Avatar,
  Box,
  Card,
  Rating,
  Typography,
} from "@mui/material";
import { SellerUser } from "interfaces/Seller";
import { monthNames } from "utils/months";



export default function SellerBox({ seller }: { seller: SellerUser }) {
  return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography
        gutterBottom
        sx={{ color: "text.secondary", fontSize: 18, fontWeight: 500 }}
      >
        VENDEUR
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "primary.main",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {seller.firstName.charAt(0) + seller.lastName.charAt(0)}
        </Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            ml: 1.5,
          }}
        >
          <Box sx={{ fontWeight: 700, fontSize: 18 }}>
            {seller.firstName} {seller.lastName}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Rating value={3} precision={0.5} size="small" readOnly />
            <Box sx={{ fontSize: 14, color: "text.secondary" }}>({0})</Box>
          </Box>
          <Box sx={{ fontSize: 14, color: "text.secondary" }}>
            Membre depuis {monthNames[seller.createdAt.getMonth()]}{" "}
            {seller.createdAt.getFullYear()}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
