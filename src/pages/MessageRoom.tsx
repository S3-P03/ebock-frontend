import {
    Box, Button, Card,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUser } from "../services/userService";
import MenuBar from "../components/MenuBar";
import useAuthSession from "../hooks/useAuthSession";
import { User } from "../interfaces/User";
import MessageBlock from "../components/MessageBlock";
import { Message, MessageRaw, Room } from "../interfaces/Message";
import { fetchMessages, fetchRoom, postMessage } from "../services/messageService";
import RoomHeader from "../components/RoomHeader";
import useWebSocket from "../hooks/useWebSocket";
import DOMPurify from "dompurify";
import { containsMalicious } from "../utils/maliciousText";
import CenteredCircularProgress from "components/CenteredCircularProgress";

export default function MessageRoom() {
    const { id } = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const { isAuthenticated, token, logout } = useAuthSession();
    const [fieldValue, setFieldValue] = useState("");

    const handleSend = () => {
        const sanitized = DOMPurify.sanitize(fieldValue.trim());
        if (!sanitized  || containsMalicious(sanitized)) return;
        
        try {
            postMessage({content: sanitized, senderCip: user!.cip, roomId: id!, token});
        } catch(error) {
            console.error("Erreur lors de l'envoi du message : ", error);
        }

        setFieldValue("");
    };

    useWebSocket(process.env.REACT_APP_API_WS_URL+`/chat/${id}`, (msg: MessageRaw) => {
        console.log(msg.sentAt);
        let formattedMessage = {
            roomId: msg.roomId,
            content: msg.content,
            senderCip: msg.senderCip,
            senderFirstName: msg.senderFirstName,
            senderLastName: msg.senderLastName,
            sentAt: new Date(msg.sentAt)
        } as Message;
        setMessages(prev => [...prev, formattedMessage]);
    });

    useEffect(() => {
        try {
            const response = fetchRoom(id, token).then((data) => {
                setRoom(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des informations de la discussion :", error);
        }
        
        try {
            const response = fetchMessages(id, token).then((data) => {
                let formattedMessages = data?.map((obj) => {
                    return {
                        roomId: obj.roomId,
                        content: obj.content,
                        senderCip: obj.senderCip,
                        senderFirstName: obj.senderFirstName,
                        senderLastName: obj.senderLastName,
                        sentAt: new Date(obj.sentAt)
                    } as Message;
                });

                setMessages(formattedMessages!);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    }, [id]);

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

    return ( room == null || user == null ? 
        (<CenteredCircularProgress />) :
        (<Box sx={{ mx: "auto" }}>
            {isAuthenticated ? <MenuBar user={user} /> : <></>}
            <Box sx={{ display: "flex", gap: 2, p: 2, flexDirection: "column", alignItems: "flex-start" }}>
                <RoomHeader room={room!} connectedCip={user!.cip}/>
                    <Card sx={{ p: 2.5, borderRadius: 2, width: "100%" }}>
                        <MessageBlock messages={messages!} cip={user!.cip} />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField fullWidth placeholder="Répondre..." variant="outlined" 
                                    value={fieldValue}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                            <Button variant="contained" onClick={handleSend} sx={{ mt: 0.5, mb: 0.5, textTransform: "none", borderRadius: 3, backgroundColor: "#1d9e75" }}>Envoyer</Button>
                        </Box>
                    </Card>
            </Box>
        </Box>
        )
    );
}