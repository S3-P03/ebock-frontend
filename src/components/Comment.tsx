import { Avatar, Box, styled } from "@mui/material";
import { ItemComment } from "../interfaces/Item";

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

export default function Comment({ comment, isReply }: { comment: ItemComment; isReply: boolean }) {
    const initials = `${comment.authorFirstName[0]}${comment.authorLastName[0]}`.toUpperCase();
    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Avatar sx={{ width: 36, height: 36, color: (isReply ? "#00796b" : "#333"), backgroundColor: (isReply ? "#e1f5ee" : "#f5f5f0"), fontSize: 13 }}>{initials}</Avatar>
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
                        <Box sx={{ fontSize: 14, color: "text.secondary" }}>{`${comment.authorFirstName} ${comment.authorLastName[0]} - ${comment.timeAgo}`}</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}