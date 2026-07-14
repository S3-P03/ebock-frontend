import { Box, styled } from "@mui/material";
import { Message } from "interfaces/Message";
import DefaultAvatar from "./DefaultAvatar";

const SentStyle = styled('div')(({ theme }) => ({
  ...theme.typography,
  backgroundColor: '#e1f5ee',
  color: '#00796b',
  padding: theme.spacing(1),
  width: 'fit-content',
  borderRadius: 12,
}));

const ReceivedStyle = styled('div')(({ theme }) => ({
    ...theme.typography,
    backgroundColor: '#f5f5f0',
    color: '#333',
    padding: theme.spacing(1),
    width: 'fit-content',
    borderRadius: 12,
}));

export default function SingleMessage({ message, isSent }: { message: Message; isSent: boolean }) {
    const initials = message.senderCip ? `${message.senderCip[3] ?? ""}${message.senderCip[0] ?? ""}`.toUpperCase() : "?";

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: (isSent ? "row-reverse" : "row"), justifyContent: "flex-start", gap: 1.5, alignItems: "flex-start" }}>
                <DefaultAvatar width={36} height={36} primaryColor={isSent} initials={initials}/>
                <Box sx={{ flexGrow: 1, display:"flex", flexDirection: (isSent ? "row-reverse" : "row") }}>
                {isSent ? (
                    <SentStyle>
                        {message.content}
                    </SentStyle>
                ) : (
                    <ReceivedStyle>
                        {message.content}
                    </ReceivedStyle>
                )}
                </Box>
            </Box>
        </Box>
    );
}