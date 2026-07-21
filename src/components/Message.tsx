import { Box, styled } from "@mui/material";
import { Message } from "interfaces/Message";
import DefaultAvatar from "./DefaultAvatar";

const SentStyle = styled('div')(({ theme }) => ({
  ...theme.typography,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  width: 'fit-content',
  borderRadius: 12,
}));

const ReceivedStyle = styled('div')(({ theme }) => ({
    ...theme.typography,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    padding: theme.spacing(1),
    width: 'fit-content',
    borderRadius: 12,
}));

interface SingleMessageProps {
    message: Message;
    isSent: boolean;
    profilePictureUrl: string | null;
}

export default function SingleMessage({ message, isSent, profilePictureUrl }: SingleMessageProps) {
    const initials = message.senderCip ? `${message.senderCip[3] ?? ""}${message.senderCip[0] ?? ""}`.toUpperCase() : "?";

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: (isSent ? "row-reverse" : "row"), justifyContent: "flex-start", gap: 1.5, alignItems: "flex-start" }}>
                <DefaultAvatar width={36} height={36} primaryColor={isSent} initials={initials} fullName={message.senderFirstName + " " + message.senderLastName} profilePictureUrl={profilePictureUrl} />
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