import { Box, styled } from "@mui/material";
import { ItemComment } from "interfaces/Item";
import DefaultAvatar from "./DefaultAvatar";

const ReplyCommentStyle = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: '#e1f5ee',
  color: '#00796b',
  padding: theme.spacing(1),
  width: 'fit-content',
  borderRadius: 12,
}));

const CommentStyle = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: '#f5f5f0',
    color: '#333',
    padding: theme.spacing(1),
    width: 'fit-content',
    borderRadius: 12,
}));

interface CommentProps {
    comment: ItemComment;
    isReply: boolean;
    profilePictureUrl: string | null;
}

export default function Comment({ comment, isReply, profilePictureUrl }: CommentProps) {
    const initials = `${comment.firstName[0]}${comment.lastName[0]}`.toUpperCase();
    const formattedDate = new Date(comment.timestamp).toLocaleDateString("fr-CA", {
        year: "numeric", month: "long", day: "numeric"
    });
    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <DefaultAvatar width={36} height={36} initials={initials} fullName={comment.firstName + " " + comment.lastName} primaryColor={isReply} profilePictureUrl={profilePictureUrl} />
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