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
import { fetchUserItems } from "../services/itemService";

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