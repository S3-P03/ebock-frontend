import { Box } from "@mui/material";
import AddItemForm from "components/AddItemForm";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { Category } from "interfaces/Category";
import { DeliveryOption } from "interfaces/DeliveryOption";
import { PaymentOption } from "interfaces/PaymentOption";
import { Tag } from "interfaces/Tag";
import { Wear } from "interfaces/Wear";
import { useEffect, useState } from "react";
import { getCategoryList } from "services/categoryService";
import { getDeliveryList } from "services/deliveryOptionService";
import { getPaymentList } from "services/paymentOptionService";
import { getTagList } from "services/tagService";
import { getWearList } from "services/wearService";


export default function AddItem() {

    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [tagsList, setTagsList] = useState<Tag[]>([]);
    const [wearsList, setWearsList] = useState<Wear[]>([]);
    const [deliveriesList, setDeliveriesList] = useState<DeliveryOption[]>([]);
    const [paymentsList, setPaymentsList] = useState<PaymentOption[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    const fetchFilterOptions = async () => {
        setLoading(true);
        try {
        const [cats, tags, wears, deliveries, payments] = await Promise.all([
            getCategoryList(),
            getTagList(),
            getWearList(),
            getDeliveryList(),
            getPaymentList(),
        ]);
        setCategoriesList(cats);
        setTagsList(tags);
        setWearsList(wears);
        setDeliveriesList(deliveries);
        setPaymentsList(payments);
        } catch (error) {
        } finally {
        setLoading(false);
        }
    };

    fetchFilterOptions();
    }, []);

    return((loading) ?
            (<CenteredCircularProgress />) :
        (<Box>
            <AddItemForm paymentOptions={paymentsList} categories={categoriesList} tags={tagsList} deliveryOptions={deliveriesList} wears={wearsList}/>
        </Box>)
    );
}