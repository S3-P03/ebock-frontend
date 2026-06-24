import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Card, CardActionArea, CardContent, IconButton,
} from "@mui/material";
import { SellerItem } from "interfaces/Item";
import { fetchImage } from "services/imageService";

export default function ItemCard({ itemList }: { itemList: SellerItem }) {
  const { itemId, name, price, firstImage } = itemList;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (firstImage) {
      setImageLoading(true);
      fetchImage(firstImage)?.then(url => {
        setImageUrl(url);
        setImageLoading(false);
      });
    }
  }, [firstImage]);

  const handleCardClick = () => {
    navigate(`/item/${itemId}`);
  };

  return (
    <Card sx={{ borderRadius: 2, position: "relative", flex: "1 1 250px", maxWidth: "350px" }}>
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 1,
          bgcolor: "white",
          borderRadius: "50%",
          width: 28,
          height: 28,
          "&:hover": {
            bgcolor: "grey.100",
          },
        }}
        role="fav-button"
      >
        ♡
      </IconButton>
      <CardActionArea onClick={handleCardClick}>
        <Box
          role="img"
          sx={{
            height: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.100",
            fontSize: 48,
            backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!imageLoading && !imageUrl && "📷"}
        </Box>
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box sx={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name}
          </Box>
          <Box sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>
            {price} $
          </Box>
          <Box sx={{ fontSize: 12, color: "text.secondary" }}>Sherbrooke</Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}