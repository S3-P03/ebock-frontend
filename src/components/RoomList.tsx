import { Box, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton } from "@mui/material";
import { Room } from "interfaces/Message";
import { User } from "interfaces/User";
import DefaultAvatar from "./DefaultAvatar";
import { useState } from "react";
import useAuthSession from "hooks/useAuthSession";
import { archiveRoom } from "services/messageService";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RoomList({rooms, user, parentCallBack, onRoomArchived}: {rooms : Room[], user: User, parentCallBack: Function, onRoomArchived?: Function}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [roomToArchive, setRoomToArchive] = useState<Room | null>(null);
    const { token } = useAuthSession();
    
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        parentCallBack(
            event,
            index
        );
    };

    const handleArchiveClick = (event: React.MouseEvent, room: Room) => {
        event.stopPropagation();
        setRoomToArchive(room);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setRoomToArchive(null);
    };

    const handleConfirmArchive = async () => {
        if (roomToArchive) {
            const status = await archiveRoom(roomToArchive.roomId.toString(), token);
            if (status === 204) {
                onRoomArchived?.(roomToArchive.roomId);
            }
            handleDialogClose();
        }
    };

    return(
        <Box>
            <List component="nav" sx={{width: "100%"}}>
                {rooms.map((room, idx) => {
                const otherUser = (room.buyerCip !== user.cip ? {cip : room.buyerCip, firstName : room.buyerFirstName, lastName : room.buyerLastName, profilePictureUrl : room.buyerProfilePicUrl} : {cip : room.sellerCip, firstName : room.sellerFirstName, lastName : room.sellerLastName, profilePictureUrl : room.sellerProfilePicUrl});
                const otherUserInitials = `${otherUser.firstName[0]}${otherUser.lastName[0]}`.toUpperCase();
                const listItemPrimary = room.itemName + " - " + otherUser.firstName + " " + otherUser.lastName;
                const isSeller = room.sellerCip === user.cip;
                    return (
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <ListItemButton key={idx} 
                                alignItems="center" 
                                onClick={(event) => handleListItemClick(event, rooms.findIndex((compare) => room === compare))}
                                sx={{ flex: 1 }}
                                >
                                    <ListItemAvatar>
                                        <DefaultAvatar width={36} height={36} primaryColor={false} initials={otherUserInitials} fullName={otherUser.firstName + " " + otherUser.lastName} profilePictureUrl={otherUser.profilePictureUrl} />
                                    </ListItemAvatar>
                                    <ListItemText primary={listItemPrimary} sx={{}}/>
                                </ListItemButton>
                                {isSeller && (
                                    <IconButton
                                        edge="end"
                                        aria-label="archive"
                                        onClick={(e) => handleArchiveClick(e, room)}
                                        sx={{ color: "error.main", mr: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                            <Divider sx={{ mt: 1.5, mb: 1 }} />
                        </Box>
                    );
                })}            
            </List>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Archiver la salle</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir archiver cette salle? Cette action ne peut pas être annulée.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Annuler</Button>
                    <Button onClick={handleConfirmArchive} color="error" variant="contained">
                        Archiver
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>);
}