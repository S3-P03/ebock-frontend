import {
  Avatar, Box, Divider, Rating,
} from "@mui/material";
import { ReviewDetail } from "services/reviewService";

export default function ReviewRow({ review }: { review: ReviewDetail }) {
    const initials = `${review.firstName.charAt(0)}${review.lastName.charAt(0)}`.toUpperCase();
    const formattedDate = new Date(review.timestamp).toLocaleDateString("fr-CA", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main", fontSize: 13 }}>
                    {initials}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ fontSize: 14, fontWeight: 600 }}>
                            {review.firstName} {review.lastName}
                        </Box>
                        <Box sx={{ fontSize: 12, color: "text.secondary" }}>{formattedDate}</Box>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly sx={{ mb: 0.5 }} />
                    <Box sx={{ fontSize: 14, color: "text.secondary" }}>{review.content}</Box>
                </Box>
            </Box>
            <Divider sx={{ mt: 1.5 }} />
        </Box>
    );
}