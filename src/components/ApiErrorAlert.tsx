import { Alert, Snackbar } from "@mui/material";

export default function ApiErrorAlert({ error, status, onClose }: { error: string | null, status: number | null, onClose: () => void }) {
    if (!error) return null;

    return (
        <Snackbar
            open={Boolean(error)}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
                {error} (Statut: {status})
            </Alert>
        </Snackbar>
    );
}