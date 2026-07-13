import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { ItemComment } from "interfaces/Item";
import Comment from "./Comment";

export default function CommentThread({ comments, isAuthenticated }: { comments: ItemComment[]; isAuthenticated: boolean }) {
    return (
        <Box>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18, fontWeight: 500 }}>
                QUESTIONS & RÉPONSES
            </Typography>
            {comments.filter((c) => c.respondToCommentId === null).map((comment) => {
                const replies = comments.filter((c) => c.respondToCommentId === comment.id).map((reply) => {
                    return { ...reply, content: `@${comment.authorFirstName} ${comment.authorLastName[0]} : ${reply.content}` };
                });
                return (
                    <Box sx={{ mt: 5 }} key={comment.id}>
                        <Comment comment={comment} isReply={false} />
                        {replies.map((reply) => (
                            <Box key={reply.id} sx={{ ml: 5, mt: 3 }}>
                                <Comment comment={reply} isReply={true} />
                            </Box>
                        ))}
                    <Divider sx={{ mt: 1.5 }} />
                    </Box>
                );
            })}
            {isAuthenticated && (
                <Box sx={{ display: "flex", gap: 2,mt: 5 }}>
                    <TextField fullWidth placeholder="Ajouter un commentaire..." variant="outlined" />
                    <Button variant="contained" sx={{ mt: 0.5, mb: 0.5, textTransform: "none", borderRadius: 3, backgroundColor: "#1d9e75" }}>Envoyer</Button>
                </Box>
            )}
        </Box>
    );
}