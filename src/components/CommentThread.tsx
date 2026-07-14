import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { ItemComment } from "interfaces/Item";
import Comment from "./Comment";

interface CommentThreadProps {
    comments: ItemComment[];
    onCommentSubmitted: (content: string, idParent: number | null) => Promise<number>;
}

export default function CommentThread({ comments, onCommentSubmitted }: CommentThreadProps) {
    return (
        <Box>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18, fontWeight: 500 }}>
                QUESTIONS & RÉPONSES
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Ajouter un commentaire..."
                    variant="outlined"
                    id="comment-input"
                />
                <Button
                    variant="contained"
                    sx={{ mt: 0.5, mb: 0.5, textTransform: "none", borderRadius: 3, backgroundColor: "#1d9e75" }}
                    onClick={() => {
                        const input = document.getElementById("comment-input") as HTMLInputElement;
                        if (input?.value.trim()) {
                            onCommentSubmitted(input.value.trim(), null).then((status) => {
                                if (status === 200) input.value = "";
                            });
                        }
                    }}
                >
                    Envoyer
                </Button>
            </Box>

            {comments.filter((c) => c.idParentComment === null).map((comment) => {
                const replies = comments.filter((c) => c.idParentComment === comment.idComment).map((reply) => {
                    return { ...reply, content: `@${comment.firstName} ${comment.lastName[0]} : ${reply.content}` };
                });
                return (
                    <Box sx={{ mt: 5 }} key={comment.idComment}>
                        <Comment comment={comment} isReply={false} />
                        {replies.map((reply) => (
                            <Box key={reply.idComment} sx={{ ml: 5, mt: 3 }}>
                                <Comment comment={reply} isReply={true} />
                            </Box>
                        ))}
                        <Divider sx={{ mt: 1.5 }} />
                    </Box>
                );
            })}
        </Box>
    );
}