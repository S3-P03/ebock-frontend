import {
  Avatar, Box, Divider, Rating,
} from "@mui/material";
import { SellerReview } from "interfaces/Seller";

export default function ReviewRow({ review }: { review: SellerReview }) {
    const initials = review.author.split(" ").map((w) => w[0]).join("").toUpperCase();
    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main", fontSize: 13 }}>{initials}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ fontSize: 14, fontWeight: 600 }}>{review.author}</Box>
                        <Box sx={{ fontSize: 12, color: "text.secondary" }}>{review.timeAgo}</Box>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly sx={{ mb: 0.5 }} />
                    <Box sx={{ fontSize: 14, color: "text.secondary" }}>{review.comment}</Box>
                </Box>
            </Box>
            <Divider sx={{ mt: 1.5 }} />
        </Box>
    );
}