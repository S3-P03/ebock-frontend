import {
  Box,
  Card,
  Divider,
  Typography,
} from "@mui/material";
import { DetailedItem } from "interfaces/Item";

export default function ItemAditionnalInfoBox({ item }: { item: DetailedItem | null }) {
  
    const itemDate = item ? new Date(item.addedAt) : null;

    const itemInfos = [
        {
            name: "État",
            info: item?.wear,
        },
        {
            name: "Ramassage/Livraison",
            info: item?.deliveryOptions,
        },
        ...(item?.price !== 0
            ? [
                {
                name: "Paiement",
                info: item?.paymentOptions,
                },
            ]
            : []),
    ];

    return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography
        gutterBottom
        sx={{ color: "text.secondary", fontSize: 18, fontWeight: 500 }}
        >
        DÉTAILS
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {itemInfos.map((info, idx) => {
            return(
                <Box sx={{ width: "100%"}}>
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "space-between", width: "100%" }}> 
                        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{info.name} </Typography>
                        {Array.isArray(info.info) ? (
                            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "right", width: "100%" }}>
                            {info.info && <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{info.info[0]}</Typography>}
                            {info.info.filter((item, idx) => {return idx!==0}).map((option) => (
                                <Box sx={{ display: "flex" }}>
                                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>- {option}</Typography>
                                </Box>
                            ))} 
                            </Box>
                        ) : (
                            <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{info.info}</Typography>)}
                    </Box>
                    <Divider sx={{ mt: 1.5, mb: 1 }} />
                </Box>
            );
            })}
            <Box sx={{ width: "100%"}}>
                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "space-between", width: "100%" }}> 
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Publié </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{itemDate?.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </Box>
            </Box>
        </Box>
    </Card>
  );
}