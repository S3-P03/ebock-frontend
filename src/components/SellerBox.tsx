import {
  Avatar,
  Box,
  Card,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import { SellerUser } from "interfaces/Seller";
import { ReviewAverage } from "services/reviewService";
import { monthNames } from "utils/months";



export default function SellerBox({ seller, reviewAverage, handleOpenStorefront }: { seller: SellerUser, reviewAverage: ReviewAverage | null, handleOpenStorefront: () => void }) {
  return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography
        gutterBottom
        sx={{ color: "text.secondary", fontSize: 18, fontWeight: 500 }}
      >
        VENDEUR
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleOpenStorefront} sx={{ p: 0 }}>
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
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: 1,
            ml: 1.5,
          }}
        >
          <Box sx={{ fontWeight: 700, fontSize: 18 }}>
            {seller.firstName} {seller.lastName}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Rating value={reviewAverage?.avgRating ?? 0} precision={0.5} size="small" readOnly />
            <Box sx={{ fontSize: 14, color: "text.secondary" }}>({reviewAverage?.nbrReviews ?? 0})</Box>
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
