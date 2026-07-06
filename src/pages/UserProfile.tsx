import {
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser } from "../interfaces/Seller";
import ProfileBox from "../components/ProfileBox";
import { fetchUser, fetchUserProfile, fetchUserStoreFront, updateUserPassword, updateUserProfile } from "../services/userService";
import Security from "../components/Security";
import UserInfo from "../components/UserInfo";
import { User, UserAddress, UserInformation} from "../interfaces/User";
import useAuthSession from "hooks/useAuthSession";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { fetchReviewAverage, ReviewAverage } from "services/reviewService";

export default function UserProfile() {
    const [me, setMe] = useState<User | null>(null);
    const { isAuthenticated, token, logout } = useAuthSession();
    
    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        try {
            fetchUser({ token, logout }).then((data) => {
                setMe(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
    }, [isAuthenticated]);
    const cip = me?.cip;
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [user, setUser] = useState<UserInformation | null>(null);
    const [reviewAverage, setReviewAverage] = useState<ReviewAverage | null>(null);

    const handleSaveProfile = async (firstName: string, lastName: string, address: UserAddress) => {
        const updated = await updateUserProfile({token, logout}, {
            user: { firstName, lastName },
            address,
        });
        if (updated) setUser({...user, ...updated});
    };

    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleChangePassword = async (oldPassword: string, newPassword: string) => {
      try {
        setPasswordError(null);
        await updateUserPassword({token, logout}, { oldPassword, newPassword });
      } catch (error: any) {
        if (error.response?.status === 400 || error.response?.status === 401) {
        setPasswordError("Mot de passe actuel incorrect.");
        }
      }
    };

    useEffect(() => {
        try {
            if (cip) {
                fetchUserStoreFront(cip).then((data) => {
                    setSeller(data);
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du profil vendeur :", error);
        }

        try {
            if (cip) {
                fetchUserProfile({token, logout}).then((data) => {
                    setUser(data);
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du profil utilisateur :", error);
        }

        if (cip) {
            fetchReviewAverage(cip).then((data) => setReviewAverage(data)).catch(console.error);
        }
    }, [cip]);


    return ( user == null || seller == null ?
        (<CenteredCircularProgress />) :
        (<Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

                <Box sx={{ width: 220, flexShrink: 0 }}>
                    <ProfileBox seller={seller} showContact={false} reviewAverage={reviewAverage} />
                </Box>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2}}>
                    <UserInfo user={user} onSave={handleSaveProfile} />
                    <Security onSave={handleChangePassword} errorMessage={passwordError}/>
                </Box>

            </Box>
        </Box>
        )
    );
}