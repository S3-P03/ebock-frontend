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
    return (                
        <Avatar sx={{ width, height, color: (primaryColor ? "primary.contrastText" : "text.primary"), backgroundColor: (primaryColor ? "primary.main" : "action.hover"), fontSize: 13 }} alt={fullName} src={profilePictureUrl || undefined}>
            {initials}
        </Avatar>
    );
}