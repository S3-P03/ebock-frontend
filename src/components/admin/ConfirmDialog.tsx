import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Users } from "interfaces/AdminUserList";

export default function ConfirmDialog( { user, onConfirm, onCancel }: { user: Users, onConfirm: (user: Users) => void, onCancel: () => void } ) {
  const open = Boolean(user);
  const willDisable = user?.enabled;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>
        {willDisable ? "Exclure l'utilisateur" : "Réactiver l'utilisateur"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          Êtes-vous certain de vouloir {willDisable ? "exclure" : "réactiver"}{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {user.firstName} {user.lastName}
          </Box>{" "}
          (CIP : {user.cip}) ?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={() => onConfirm(user)}
          variant="contained"
          color={willDisable ? "error" : "success"}
        >
          Oui, confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}