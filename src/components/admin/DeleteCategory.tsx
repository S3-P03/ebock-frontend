import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from "@mui/material";
import { CategoryInfo } from "../../interfaces/Category";

interface DeleteCategoryDialogProps {
  category: CategoryInfo;
  hasChildren: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCategory({
  category, hasChildren, onConfirm, onCancel,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open onClose={onCancel}>
      <DialogTitle>Supprimer la catégorie</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {hasChildren
            ? `"${category.name}" contient des sous-catégories. Supprime ou déplace d'abord ses sous-catégories.`
            : `Supprimer "${category.name}" ? Cette action est irréversible.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={hasChildren}>
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}