import {
    Box, Card, CircularProgress,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../services/userService";
import MenuBar from "../components/MenuBar";
import useAuthSession from "../hooks/useAuthSession";
import { User } from "../interfaces/User";
import { Room } from "../interfaces/Message";
import { fetchUserRooms} from "../services/messageService";
import { useNavigate } from "react-router-dom";
import RoomList from "components/RoomList";

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
        try {
            const response = fetchUserRooms(token).then((data) => {
                setRooms(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des salles de discussion :", error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        try {
            fetchUser({ token, logout }).then((data) => {
                setUser(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
    }, [isAuthenticated]);

    return ( rooms == null || user == null ? 
        (<CircularProgress />) :
        (<Box sx={{ mx: "auto" }}>
            {isAuthenticated ? <MenuBar user={user} /> : <></>}¸
            <Card sx={{ m: 2, p: 2.5, borderRadius: 2 }}>
                <Typography
                gutterBottom
                sx={{ fontSize: 24, fontWeight: 600 }}
                >
                    CONVERSATIONS
                </Typography>
                <RoomList rooms={rooms} user={user} parentCallBack={handleListItemClick}/>
            </Card>
        </Box>
        )
    );
}