import {
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser, fetchUserProfile, updateUserPassword, updateUserProfile, updateUserProfilePicture } from "../services/userService";
import { uploadImageFile } from "../services/imageService";
import Security from "../components/Security";
import UserInfo from "../components/UserInfo";
import { User, UserAddress, UserInformation} from "../interfaces/User";
import useAuthSession from "hooks/useAuthSession";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import ProfilePicChanger from "components/ProfilePicChanger";

export default function UserProfile() {
    const [me, setMe] = useState<User | null>(null);
    const { isAuthenticated, token, logout } = useAuthSession();
    
    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        fetchUser({ token, logout }).then((data) => {
            setMe(data);
        });
    }, [isAuthenticated]);

    const cip = me?.cip;
    const [user, setUser] = useState<UserInformation | null>(null);

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
        if (error.status === 400 || error.status === 401) {
            setPasswordError("Mot de passe actuel incorrect.");
        }
      }
    };

    useEffect(() => {
        if (cip) {
            fetchUserProfile({token, logout}).then((data) => {
                setUser(data);
            });
        }
    }, [cip]);


    return ( user == null ?
        (<CenteredCircularProgress />) :
        (<Box sx={{ mx: "auto", px: 10, py: 10 }}>
            <Box sx={{ display: "flex", gap: 5, alignItems: "flex-start" }}>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2}}>
                    <ProfilePicChanger
                      currentProfilePictureUrl={user.user.profilePictureUrl}
                      initials={user.user.firstName.charAt(0).toUpperCase() + user.user.lastName.charAt(0).toUpperCase()}
                      onSave={async (file, remove) => {
                        if (!token) return;

                        let profilePictureGuid = "";

                        if (!remove) {
                          if (!file) return;
                          const uploadResult = await uploadImageFile(file, token);
                          if (!uploadResult?.guid) return;
                          profilePictureGuid = uploadResult.guid;
                        }

                        const updateProfilePictureUrl = await updateUserProfilePicture({ token, logout }, {
                          guid: profilePictureGuid,
                        });

                        if (updateProfilePictureUrl !== undefined) {
                          window.location.reload();
                        }
                      }}
                    />
                    <UserInfo user={user} onSave={handleSaveProfile} />
                    <Security onSave={handleChangePassword} errorMessage={passwordError}/>
                </Box>

            </Box>
        </Box>
        )
    );
}