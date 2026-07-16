import { Avatar } from "@mui/material";

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
        <Avatar sx={{ width, height, color: (primaryColor ? "#00796b" : "#333"), backgroundColor: (primaryColor ? "#e1f5ee" : "#f5f5f0"), fontSize: 13 }} alt={fullName} src={profilePictureUrl || undefined}>
            {initials}
        </Avatar>
    );
}