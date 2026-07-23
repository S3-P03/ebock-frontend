import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from "@mui/material";
import { SpecificationInfo } from "interfaces/Specification";

interface DeleteCategoryDialogProps {
  specification: SpecificationInfo;
  hasChildren: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteSpecification({
  specification, hasChildren, onConfirm, onCancel,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open onClose={onCancel}>
      <DialogTitle>Supprimer une spécification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {hasChildren
            ? `"${specification.name}" contient des sous-catégories. Supprime ou déplace d'abord ses sous-catégories.`
            : `Supprimer "${specification.name}" ? Cette action est irréversible.`}
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