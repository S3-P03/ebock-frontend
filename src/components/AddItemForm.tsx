import { Box } from "@mui/material";
import { Category } from "interfaces/Category";
import { DeliveryOption } from "interfaces/DeliveryOption";
import { PaymentOption } from "interfaces/PaymentOption";
import { Tag } from "interfaces/Tag";
import { Wear } from "interfaces/Wear";

export default function AddItemForm({
  paymentOptions,
  deliveryOptions,
  tags,
  categories,
  wears,
}: {
  paymentOptions: PaymentOption[];
  deliveryOptions: DeliveryOption[];
  tags: Tag[];
  categories: Category[];
  wears: Wear[];
}) {
    return(
        <Box>
            
        </Box>
    );
}
