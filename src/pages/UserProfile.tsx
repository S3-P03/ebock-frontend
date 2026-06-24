import {
    Box, CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser } from "../interfaces/Seller";
import ProfileBox from "../components/ProfileBox";
import { useParams } from "react-router-dom";
import { fetchUserProfile, fetchUserSecurity, fetchUserStoreFront } from "../services/userService";
import Securite from "../components/Securite";
import InformationsPersonnelles from "../components/InfoPerso";
import { UserInfoPerso, UserSecurity } from "../interfaces/User";

export default function UserProfile() {
    const { cip } = useParams();
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [user, setUser] = useState<UserInfoPerso | null>(null);
    const [security, setSecurity] = useState<UserSecurity | null>(null);
    useEffect(() => {
        try {
            fetchUserStoreFront(cip).then((data) => {
                setSeller(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du profil vendeur :", error);
        }

        try {
            fetchUserProfile(cip).then((data) => {
                setUser(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du profil utilisateur :", error);
        }

        try {
            fetchUserSecurity(cip).then((data) => {
                setSecurity(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération de la sécurité :", error);
        }
    }, [cip]);


    return ( user == null || security == null || seller == null ?
        (<CircularProgress />) :
        (<Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

                <Box sx={{ width: 220, flexShrink: 0 }}>
                    <ProfileBox seller={seller} showContact={false} />
                </Box>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2}}>
                    <InformationsPersonnelles user={user} />
                    <Securite user={security} />
                </Box>

            </Box>
        </Box>
        )
    );
}