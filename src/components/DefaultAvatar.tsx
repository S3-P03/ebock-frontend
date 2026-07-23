import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { getImageUrlWithEnvironment } from "services/apiClient";

interface DefaultAvatarProps {
    width: number;
    height: number;
    primaryColor: boolean;
    initials: String;
    fullName: string;
    profilePictureUrl: string | null;
}

export default function DefaultAvatar({width, height, primaryColor, initials, fullName, profilePictureUrl} : DefaultAvatarProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        getImageUrlWithEnvironment(profilePictureUrl).then(url => {
            setImageSrc(url);
        });
    }, [profilePictureUrl]);

    return (                
        <Avatar sx={{ width, height, color: (primaryColor ? "primary.contrastText" : "text.primary"), backgroundColor: (primaryColor ? "primary.main" : "action.hover"), fontSize: 13 }} alt={fullName} src={imageSrc || undefined}>
            {initials}
        </Avatar>
    );
}