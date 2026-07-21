import { Box, styled } from "@mui/material";
import { CommentDetail } from "interfaces/Comment";
import DefaultAvatar from "./DefaultAvatar";

const ReplyCommentStyle = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "primary.light",
  color: "primary.dark",
  padding: theme.spacing(1),
  width: 'fit-content',
  borderRadius: 12,
}));

const CommentStyle = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    padding: theme.spacing(1),
    width: 'fit-content',
    borderRadius: 12,
}));

interface CommentProps {
    comment: CommentDetail;
    isReply: boolean;
}

export default function Comment({ comment, isReply }: CommentProps) {
    const initials = `${comment.firstName[0]}${comment.lastName[0]}`.toUpperCase();
    const timestamp = new Date(comment.timestamp);
    const today = new Date();

    const formattedDate = 
        timestamp.toDateString() === today.toDateString()
            ? `Aujourd'hui à ${timestamp.toLocaleTimeString("fr-CA", {
                hour: "2-digit",
                minute: "2-digit",
            })}`
            : timestamp.toLocaleString("fr-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <DefaultAvatar width={36} height={36} initials={initials} fullName={comment.firstName + " " + comment.lastName} primaryColor={isReply} profilePictureUrl={comment.profilePictureUrl} />
                <Box sx={{ flexGrow: 1 }}>
                    {isReply ? (
                        <ReplyCommentStyle>
                            {comment.content}
                        </ReplyCommentStyle>
                    ) : (
                        <CommentStyle>
                            {comment.content}
                        </CommentStyle>
                    )}
                    <Box sx={{ display: "flex"}}>
                        <Box sx={{ fontSize: 14, color: "text.secondary" }}>{`${comment.firstName} ${comment.lastName[0]} - ${formattedDate}`}</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}