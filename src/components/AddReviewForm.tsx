import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface AddReviewFormProps {
    onReviewSubmitted: (content: string, rating: number) => Promise<number>;
}

export default function AddReviewForm({ onReviewSubmitted }: AddReviewFormProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!rating) {
            setError("Veuillez sélectionner une note.");
            return;
        }
        if (!content.trim()) {
            setError("Veuillez écrire un commentaire.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        
        const status = await onReviewSubmitted(content, rating);
        if (status === 200) {
            setRating(null);
            setContent("");
        } else if (status === 403) {
            setError("Vous devez avoir eu une conversation avec ce vendeur pour laisser un avis.");
        } else {
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
        setIsSubmitting(false);
    };

    return (
        <Box sx={{ mt: 3, p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 2 }}>
                Laisser un avis
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                    Note
                </Typography>
                <Rating
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                    size="large"
                />
            </Box>
            <TextField
                label="Commentaire"
                multiline
                rows={3}
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
            />
            {error && (
                <Typography sx={{ fontSize: 13, color: "error.main", mb: 1 }}>
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{ textTransform: "none" }}
            >
                {isSubmitting ? "Envoi en cours..." : "Soumettre"}
            </Button>
        </Box>
    );
}