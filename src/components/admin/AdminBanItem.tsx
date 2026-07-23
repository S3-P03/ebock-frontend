import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";

import ConfirmCard from "components/admin/ConfirmCard";
import { DetailedItem } from "interfaces/Item";
import { fetchItem, banItem } from "services/itemService";
import useAuthSession from "hooks/useAuthSession";

export default function AdminBanItem() {
    const [itemId, setItemId] = useState("");
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState<DetailedItem | null>(null);
    const [loading, setLoading] = useState(false);
    const { token, logout } = useAuthSession();

    const handleOpenBanPopup = async () => {
        const response = await fetchItem(itemId);
        if (!response) {
            setItemId("");
            return;
        }
        setItem(response);
        setOpen(true);
    };

    const handleConfirmBan = async () => {
        if (!itemId.trim()) return;
        
        setLoading(true);
        try {
            const success = await banItem({ token, logout }, itemId);
            if (success) {
                setOpen(false);
                setItemId("");
                setItem(null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Paper
            elevation={3}
            sx={{
            p: 3,
            mt: 3,
            borderRadius: 2,
            maxWidth: 500
            }}
        >

            <Box
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: 18
                }}
            >
                Bannir un item
            </Box>

            <TextField
                fullWidth
                label="ID de l'item"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleOpenBanPopup}
                disabled={loading}
            >
                Bannir l'item
            </Button>

        </Paper>

        <Dialog
            open={open}
            onClose={() => setOpen(false)}
        >

            <DialogTitle>
                Confirmation du bannissement
            </DialogTitle>

            <DialogContent>

                {item && (
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2
                    }}
                    >
                    <ConfirmCard item={item}/>
                    </Box>
                )}

            </DialogContent>

            <DialogActions>

            <Button
                onClick={() => setOpen(false)}
            >
                Annuler
            </Button>

            <Button
                color="error"
                variant="contained"
                onClick={handleConfirmBan}
            >
                Confirmer
            </Button>

            </DialogActions>

        </Dialog>

        </>
    );
}