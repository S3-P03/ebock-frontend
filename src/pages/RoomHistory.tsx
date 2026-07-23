import {
    Box, Card,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "services/userService";
import useAuthSession from "hooks/useAuthSession";
import { User } from "interfaces/User";
import { Room } from "interfaces/Message";
import { fetchUserRooms} from "services/messageService";
import { useNavigate } from "react-router-dom";
import RoomList from "components/RoomList";
import CenteredCircularProgress from "components/CenteredCircularProgress";

export default function RoomHistory() {
    const [rooms, setRooms] = useState<Room[] | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const { isAuthenticated, token, logout } = useAuthSession();
    let navigate = useNavigate();

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        navigate(`/message/${rooms![index].roomId}`);
    };
    
    useEffect(() => {
        fetchUserRooms(token).then((data) => {
            setRooms(data);
        });
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        fetchUser({ token, logout }).then((data) => {
            setUser(data);
        });
    }, [isAuthenticated]);

    const handleRoomArchived = (archivedRoomId: number) => {
        setRooms((prevRooms) => prevRooms?.filter((room) => room.roomId !== archivedRoomId) || null);
    }

    return ( rooms == null || user == null ? 
        (<CenteredCircularProgress />) :
        (<Box sx={{ mx: "auto" }}>
            <Card sx={{ m: 2, p: 2.5, borderRadius: 2 }}>
                <Typography
                gutterBottom
                sx={{ fontSize: 24, fontWeight: 600 }}
                >
                    CONVERSATIONS
                </Typography>
                <RoomList rooms={rooms} user={user} parentCallBack={handleListItemClick} onRoomArchived={handleRoomArchived} />
            </Card>
        </Box>
        )
    );
}