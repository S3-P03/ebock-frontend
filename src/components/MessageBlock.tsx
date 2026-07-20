import { Box } from "@mui/material";
import { Message } from "interfaces/Message";
import SingleMessage from "./Message";

interface MessageBlockProps {
    messages: Message[];
    cip: string;
    senderProfilePictureUrl: string | null;
    receiverProfilePictureUrl: string | null;
}

export default function MessageBlock({ messages, cip, senderProfilePictureUrl, receiverProfilePictureUrl }: MessageBlockProps) {
    
    const now = new Date();
    let next = {} as Message;
    let sameSender = false;

    return (
        <Box sx={{display: "flex", flexDirection: "column", pl: 2, pr: 2, pt: 1, pb: 1, gap: 1}}>
            {messages.map((message, idx, arr) => {
                next = arr[idx + 1] ?? null;
                const isLast = idx === arr.length - 1;
                sameSender = !isLast && next?.senderCip === message.senderCip;
                return (
                    <Box key={idx} sx={{display: "flex", flexDirection: "column"}}>
                        <SingleMessage message={message} isSent={message.senderCip==cip} profilePictureUrl={message.senderCip==cip ? senderProfilePictureUrl : receiverProfilePictureUrl} />
                        { !sameSender && 
                            <Box sx={{ display: "flex", mb: 4, justifyContent: (message.senderCip==cip ? "flex-end" : "flex-start") }}>
                                <Box sx={{ fontSize: 14, color: "text.secondary" }}>{`${message.senderFirstName} ${message.senderLastName[0]} - ${now.getDate() !== message.sentAt?.getDate() ? (message.sentAt?.getDate() + "/" + String(message.sentAt?.getMonth()).padStart(2, "0")) : ""} ${message.sentAt?.getHours()}:${String(message.sentAt?.getMinutes()).padStart(2, "0")}`}</Box>
                            </Box>
                        }
                    </Box>
                );
            })}
        </Box>
    );
}