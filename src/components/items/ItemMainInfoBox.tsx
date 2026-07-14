import { Box, Card, styled, Typography } from "@mui/material";
import { DetailedItem } from "interfaces/Item";

const CategoryStyle = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: '#e1f5ee',
  color: '#00796b',
  padding: theme.spacing(1),
  width: 'fit-content',
  borderRadius: 12,
}));

export default function ItemMainInfoBox({item} : {item: DetailedItem | null}) {
    return (
        <Card sx={{ p: 2.5, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{item?.name}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 30, color: "#1d9e75" }}>{`${item?.price === 0 ? "Gratuit" : `${item?.price.toFixed(2)}$`}`}</Typography>
            <CategoryStyle>{item?.category}</CategoryStyle>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {item?.description}
            </Typography>
        </Box>
        </Card>
    );
}