import { Box } from "@mui/material";
import AddItemForm from "components/AddItemForm";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { Category } from "interfaces/Category";
import { DeliveryOption } from "interfaces/DeliveryOption";
import { PaymentOption } from "interfaces/PaymentOption";
import { Tag } from "interfaces/Tag";
import { Wear } from "interfaces/Wear";
import { useEffect, useState } from "react";
import { fetchCategories } from "services/categoryService";
import { fetchDeliveryOptions } from "services/deliveryOptionService";
import { fetchPaymentOptions } from "services/paymentOptionService";
import { fetchTags } from "services/tagService";
import { fetchWears } from "services/wearService";


export default function AddItem() {

    const [paymentOptions, setPaymentOptions] = useState<PaymentOption[] | null>(null);
    const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[] | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [tags, setTags] = useState<Tag[] | null>(null);
    const [wears, setWears] = useState<Wear[] | null>(null);

    useEffect(() => {
        try {
            fetchPaymentOptions().then((data) => {
                setPaymentOptions(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des options de paiement :", error);
        }
        
        try {
            fetchDeliveryOptions().then((data) => {
                setDeliveryOptions(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des options de livraison :", error);
        }

        try {
            fetchCategories().then((data) => {
                setCategories(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }

        try {
            fetchWears().then((data) => {
                setWears(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des niveaux d'usure :", error);
        }

        try {
            fetchTags().then((data) => {
                setTags(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des tags :", error);
        }
    }, []);

    return((paymentOptions == null || deliveryOptions == null || categories == null || tags == null || wears == null) ?
            (<CenteredCircularProgress />) :
        (<Box>
            <AddItemForm paymentOptions={paymentOptions} categories={categories} tags={tags} deliveryOptions={deliveryOptions} wears={wears}/>
        </Box>)
    );
}