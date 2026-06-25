import {
  Avatar, Box, Button, Card,
  Divider, Rating,
} from "@mui/material";
import { SellerUser } from "interfaces/Seller";
import { ReviewAverage } from "services/reviewService";

export default function ProfileBox ({seller, reviewAverage, showContact = true}: { seller: SellerUser, reviewAverage: ReviewAverage | null, showContact?: boolean }) {
  return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mb: 2 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: 22, fontWeight: 700 }}>
          {seller.firstName.charAt(0) + seller.lastName.charAt(0)}
        </Avatar>
        <Box sx={{ fontWeight: 700, fontSize: 16 }}>
          {seller.firstName} {seller.lastName}
        </Box>
        <Box sx={{ fontSize: 14, color: "text.secondary" }}>Localisation</Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Rating value={reviewAverage?.avgRating ?? 0} precision={0.5} size="small" readOnly />
          <Box sx={{ fontSize: 12, color: "text.secondary" }}>({reviewAverage?.nbrReviews ?? 0})</Box>
        </Box>
        <Box sx={{ fontSize: 12, color: "text.secondary" }}>Membre depuis {seller.createdAt.getFullYear()}</Box>
      </Box>

      {showContact && (
        <Button variant="contained" fullWidth size="small" sx={{ borderRadius: 2, mb: 2, textTransform: "none" }}>
          Contacter
        </Button>
      )}

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Box sx={{ fontSize: 14, color: "text.secondary" }}>Articles vendus</Box>
        <Box sx={{ fontSize: 14, fontWeight: 600 }}>{0}</Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ fontSize: 14, color: "text.secondary" }}>Articles en vente</Box>
        <Box sx={{ fontSize: 14, fontWeight: 600 }}>{0}</Box>
      </Box>
    </Card>
  )
}