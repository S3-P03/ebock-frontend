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
    const today = new Date();

    return (
        <Box sx={{display: "flex", flexDirection: "column", pl: 2, pr: 2, pt: 1, pb: 1, gap: 1}}>
            {messages.map((message, idx, arr) => {
                next = arr[idx + 1] ?? null;
                const isLast = idx === arr.length - 1;
                sameSender = !isLast && next?.senderCip === message.senderCip;
                const isToday = message.sentAt.toDateString() === today.toDateString();
                const sentAt = new Date(message.sentAt);
                return (
                    <Box key={idx} sx={{display: "flex", flexDirection: "column"}}>
                        <SingleMessage message={message} isSent={message.senderCip==cip} profilePictureUrl={message.senderCip==cip ? senderProfilePictureUrl : receiverProfilePictureUrl} />
                        { !sameSender && 
                            <Box sx={{ display: "flex", mb: 4, justifyContent: (message.senderCip==cip ? "flex-end" : "flex-start") }}>
                                <Box sx={{ fontSize: 14, color: "text.secondary" }}>
                                    {`${message.senderFirstName} ${message.senderLastName[0]} - ${
                                        isToday
                                        ? sentAt.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : sentAt.toLocaleString([], {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                    }`}
                                </Box>
                            </Box>
                        }
                    </Box>
                );
            })}
        </Box>
    );
}