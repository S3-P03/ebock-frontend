import {
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { DetailedItem } from "interfaces/Item";
import { useState, ChangeEvent } from "react";

type Props = {
  item: DetailedItem | null;
  changeItemQuantity: (value: number) => void;
};

export default function ItemSellerOptionBox({ item, changeItemQuantity }: Props) {
  const [removeQty, setRemoveQty] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  if (!item) return <CenteredCircularProgress />;

  const validate = (valStr: string) => {
    if (valStr === "") {
      setError("");
      setIsValid(false);
      return false;
    }
    const val = Number(valStr);
    if (!Number.isFinite(val) || !Number.isInteger(val)) {
      setError("Entier requis");
      setIsValid(false);
      return false;
    }
    if (val <= 0) {
      setError("Doit être supérieur à 0");
      setIsValid(false);
      return false;
    }
    if (val > item.quantity) {
      setError("Supérieur à la quantité restante");
      setIsValid(false);
      return false;
    }
    setError("");
    setIsValid(true);
    return true;
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setRemoveQty(v);
    validate(v);
  };

  const removeAmountFromQuantity = (value: number) => {
      changeItemQuantity(value);
  };

  return (item.quantity === 0 ? (
        <Typography>Stock épuisé</Typography>
      ) : item.quantity === 1 ? (
        <Button
          variant="contained"
          size="small"
          sx={{ width: "100%", borderRadius: 2, minHeight: 48, backgroundColor: "#1d9e75" }}
          onClick={() => removeAmountFromQuantity(1)}
        >
          Marquer comme vendu
        </Button>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2, width: "100%", flexWrap: "nowrap" }}>
          <Typography sx={{ whiteSpace: "nowrap", textAlign: "center", minWidth: 120 }}>
            Qté restante: {item.quantity}
          </Typography>
          <TextField
            label="Quantité à retirer"
            value={removeQty}
            onChange={onChangeInput}
            error={!!error}
            helperText={error || ""}
            type="number"
            inputProps={{ min: 1, max: item.quantity }}
            size="small"
            sx={{ minWidth: 120, maxWidth: 160 }}
          />
          <Button
            variant="contained"
            size="small"
            disabled={!isValid}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              backgroundColor: "#1d9e75",
              whiteSpace: "nowrap",
              width: "100%",
              "&.Mui-disabled": {
                backgroundColor: "rgba(29, 158, 117, 0.4)",
                color: "rgba(255,255,255,0.7)",
              },
            }}
            onClick={() => isValid && removeAmountFromQuantity(Number(removeQty))}
          >
            Diminuer quantité
          </Button>
        </Box>
      )
  );
}