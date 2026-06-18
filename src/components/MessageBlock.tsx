import { Box } from "@mui/material";
import { Message } from "../interfaces/Message";
import SingleMessage from "./Message";

export default function MessageBlock({ messages, cip }: { messages: Message[], cip: string }) {
    
    const now = new Date();
    let next = {} as Message;
    let sameSender = false;

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            {messages.map((message, idx, arr) => {
                next = arr[idx + 1] ?? null;
                const isLast = idx === arr.length - 1;
                sameSender = !isLast && next?.senderCip === message.senderCip;
                return (
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <SingleMessage message={message} isSent={message.senderCip==cip} />
                        { !sameSender && message.senderCip==cip && 
                            <Box sx={{ display: "flex", mb: 4, justifyContent: "flex-end"}}>
                                <Box sx={{ fontSize: 14, color: "text.secondary" }}>{`${message.senderFirstName} ${message.senderLastName[0]} - ${now.getDate() !== message.sentAt?.getDate() ? (message.sentAt?.getDate() + "/" + String(message.sentAt?.getMonth()).padStart(2, "0")) : ""} ${message.sentAt?.getHours()}:${String(message.sentAt?.getMinutes()).padStart(2, "0")}`}</Box>
                            </Box>
                        }
                        { !sameSender && message.senderCip!=cip && 
                            <Box sx={{ display: "flex", mb: 4, justifyContent: "flex-start"}}>
                                <Box sx={{ fontSize: 14, color: "text.secondary" }}>{`${message.senderFirstName} ${message.senderLastName[0]} - ${now.getDate() !== message.sentAt?.getDate() ? (message.sentAt?.getDate() + "/" + String(message.sentAt?.getMonth()).padStart(2, "0")) : ""} ${message.sentAt?.getHours()}:${String(message.sentAt?.getMinutes()).padStart(2, "0")}`}</Box>
                            </Box>
                        }
                    </Box>
                );
                
            })}
        </Box>
    );
}