import {
    Avatar, Box, Button, Card, CardActionArea, CardContent,
    CircularProgress,
    Divider, IconButton, Rating,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser, SellerItem, SellerReview } from "../interfaces/Seller";
import ProfileBox from "../components/ProfileBox";
import ItemDisplayBox from "../components/ItemDisplayBox";
import { useParams } from "react-router-dom";
import { fetchUserStoreFront } from "../services/userService";
import { fetchUserItems } from "../services/userService";

const sellerReviews: SellerReview[] = [
    { id: 1, author: "Eliane P.", rating: 5, comment: "Super vendeuse, très rapide à répondre.", timeAgo: "il y a 2 semaines" },
    { id: 2, author: "Leanne H.", rating: 4, comment: "Ramassage rapide et sans problème, je recommande !", timeAgo: "il y a 3 mois" },
    { id: 3, author: "William D.", rating: 3, comment: "Bon vendeur, réponse rapide.", timeAgo: "il y a 5 mois" },
];

function ReviewRow({ review }: { review: SellerReview }) {
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

export default function SellerProfile() {
    const { cip } = useParams();
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [items, setItems] = useState<SellerItem[] | null>(null);
    useEffect(() => {
        try {
            const response = fetchUserStoreFront(cip).then((data) => {
                setSeller(data);
                console.log(seller?.createdAt.getFullYear());
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du vendeur :", error);
        }

        try {
            const response = fetchUserItems(cip).then((data) => {
                setItems(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des items :", error);
        }
    }, [cip]);

    return ( seller == null ?
        (<CircularProgress />) :
        (<Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

                <Box sx={{ width: 220, flexShrink: 0 }}>
                    <ProfileBox seller={seller} showContact={true} />
                </Box>

                <ItemDisplayBox items={items ?? []} />

            </Box>
        </Box>
        )
    );
}