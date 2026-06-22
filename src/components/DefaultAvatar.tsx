import { Avatar } from "@mui/material";

export default function DefaultAvatar({width, height, primaryColor, initials} : {width: number, height: number, primaryColor: boolean, initials: String}) {
    return (                
        <Avatar sx={{ width, height, color: (primaryColor ? "#00796b" : "#333"), backgroundColor: (primaryColor ? "#e1f5ee" : "#f5f5f0"), fontSize: 13 }}>{initials}</Avatar>
    );
}