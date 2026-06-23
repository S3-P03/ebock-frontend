import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser, SellerItem } from "interfaces/Seller";
import ProfileBox from "components/ProfileBox";
import ItemDisplayBox from "components/items/ItemDisplayBox";
import { useParams } from "react-router-dom";
import { fetchUserStoreFront } from "services/userService";
import { fetchUserItems } from "services/itemService";
import CenteredCircularProgress from "components/CenteredCircularProgress";

export default function SellerProfile() {
    const { cip } = useParams();
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [items, setItems] = useState<SellerItem[] | null>(null);
    useEffect(() => {
        try {
            fetchUserStoreFront(cip).then((data) => {
                setSeller(data);
                console.log(seller?.createdAt.getFullYear());
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du vendeur :", error);
        }

        try {
            fetchUserItems(cip).then((data) => {
                setItems(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des items :", error);
        }
    }, [cip]);

    return ( seller == null ?
        (<CenteredCircularProgress />) :
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