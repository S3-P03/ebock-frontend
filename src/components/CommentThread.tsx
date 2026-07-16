import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { ItemComment } from "interfaces/Item";
import Comment from "./Comment";
import { useState } from "react";

interface CommentThreadProps {
    comments: ItemComment[];
    onCommentSubmitted: (content: string, idParent: number | null) => Promise<number>;
    isSeller: boolean;
    isAuthenticated: boolean;
}

export default function CommentThread({ comments, onCommentSubmitted, isSeller, isAuthenticated }: CommentThreadProps) {
    const [inputValue, setInputValue] = useState("");
    const [replyingTo, setReplyingTo] = useState<ItemComment | null>(null);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const idParent = replyingTo ? replyingTo.idComment : null;
        const status = await onCommentSubmitted(inputValue.trim(), idParent);
        if (status === 200) {
            setInputValue("");
            setReplyingTo(null);
        }
    };

    return (
        <Box>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18, fontWeight: 500 }}>
                QUESTIONS & RÉPONSES
            </Typography>

            {isAuthenticated && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, mb: 3 }}>
                    {replyingTo && (
                        <Box sx={{ fontSize: 13, color: "text.secondary", display: "flex", alignItems: "center", gap: 1 }}>
                            Répondre à <strong>{replyingTo.firstName} {replyingTo.lastName[0]}</strong>
                            <Button size="small" onClick={() => setReplyingTo(null)} sx={{ textTransform: "none", p: 0, minWidth: "auto", color: "error.main" }}>
                                Annuler
                            </Button>
                        </Box>
                    )}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            placeholder={replyingTo ? `Répondre à ${replyingTo.firstName}...` : "Ajouter un commentaire..."}
                            variant="outlined"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 0.5, mb: 0.5, textTransform: "none", borderRadius: 3, backgroundColor: "#1d9e75" }}
                            onClick={handleSend}
                        >
                            Envoyer
                        </Button>
                    </Box>
                </Box>
            )}

            {comments.filter((c) => c.idParentComment === null).map((comment) => {
                const replies = comments.filter((c) => c.idParentComment === comment.idComment).map((reply) => {
                    return { ...reply, content: `@${comment.firstName} ${comment.lastName[0]} : ${reply.content}` };
                });
                return (
                    <Box sx={{ mt: 5 }} key={comment.idComment}>
                        <Comment comment={comment} isReply={false} profilePictureUrl={null} />
                        {isSeller && (
                            <Button
                                size="small"
                                sx={{ textTransform: "none", fontSize: 12, color: "text.secondary", ml: 6 }}
                                onClick={() => setReplyingTo(comment)}
                            >
                                Répondre
                            </Button>
                        )}
                        {replies.map((reply) => (
                            <Box key={reply.idComment} sx={{ ml: 5, mt: 1 }}>
                                <Comment comment={reply} isReply={true} profilePictureUrl={null} />
                            </Box>
                        ))}
                        <Divider sx={{ mt: 1.5 }} />
                    </Box>
                );
            })}
        </Box>
    );
}