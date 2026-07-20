import { Box, Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { Room } from "interfaces/Message";
import { User } from "interfaces/User";
import DefaultAvatar from "./DefaultAvatar";

export default function RoomList({rooms, user, parentCallBack}: {rooms : Room[], user: User, parentCallBack: Function}) {
    
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        parentCallBack(
            event,
            index
        );
    };

    return(
        <List component="nav" sx={{width: "100%"}}>
            {rooms.map((room, idx) => {
            const otherUser = (room.buyerCip !== user.cip ? {cip : room.buyerCip, firstName : room.buyerFirstName, lastName : room.buyerLastName, profilePictureUrl : room.buyerProfilePicUrl} : {cip : room.sellerCip, firstName : room.sellerFirstName, lastName : room.sellerLastName, profilePictureUrl : room.sellerProfilePicUrl});
            const otherUserInitials = `${otherUser.firstName[0]}${otherUser.lastName[0]}`.toUpperCase();
            const listItemPrimary = room.itemName + " - " + otherUser.firstName + " " + otherUser.lastName;
                return (
                    <Box>
                        <ListItemButton key={idx} 
                        alignItems="center" 
                        onClick={(event) => handleListItemClick(event, rooms.findIndex((compare) => room === compare))}
                        >
                            <ListItemAvatar>
                                <DefaultAvatar width={36} height={36} primaryColor={false} initials={otherUserInitials} fullName={otherUser.firstName + " " + otherUser.lastName} profilePictureUrl={otherUser.profilePictureUrl} />
                            </ListItemAvatar>
                            <ListItemText primary={listItemPrimary} sx={{}}/>
                        </ListItemButton>
                        <Divider sx={{ mt: 1.5, mb: 1 }} />
                    </Box>
                );
            })}            
        </List>);
}