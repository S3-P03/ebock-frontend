import {
  Avatar,
  Box,
  Card,
  Divider,
  Typography,
} from "@mui/material";
import { DetailedItem } from "../interfaces/Item";

export default function ItemAditionnalInfoBox({ item }: { item: DetailedItem | null }) {
  
    const itemDate = item ? new Date(item.addedAt) : null;

    return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography
        gutterBottom
        sx={{ color: "text.secondary", fontSize: 18, fontWeight: 500 }}
        >
        DÉTAILS
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ width: "100%"}}>
                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "space-between", width: "100%" }}> 
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>État </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{item?.wear}</Typography>
                </Box>
                <Divider sx={{ mt: 1.5, mb: 1 }} />
            </Box>
            <Box sx={{ width: "100%"}}>
                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "space-between", width: "100%" }}> 
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Ramassage </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Campus UdeS</Typography>
                </Box>
                <Divider sx={{ mt: 1.5, mb: 1 }} />
            </Box>
            <Box sx={{ width: "100%"}}>
                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "space-between", width: "100%" }}> 
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Paiement </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Interac - Comptant</Typography>
                </Box>
                <Divider sx={{ mt: 1.5, mb: 1 }} />
            </Box>
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
