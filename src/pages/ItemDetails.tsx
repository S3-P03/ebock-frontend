import {
    Box, Button, Card,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser } from "interfaces/Seller";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser, fetchUserStoreFront } from "services/userService";
import { DetailedItem, ItemComment, ItemImage } from "interfaces/Item";
import { fetchItem, fetchItemImages } from "services/itemService";
import useAuthSession from "hooks/useAuthSession";
import { User } from "interfaces/User";
import CommentThread from "components/CommentThread";
import ImageList from "components/ImageList";
import SellerBox from "components/SellerBox";
import ItemAditionnalInfoBox from "components/items/ItemAdditionalInfoBox";
import ItemMainInfoBox from "components/items/ItemMainInfoBox";
import { fetchImage } from "services/imageService";
import { createRoom } from "services/messageService";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { Camera } from "@mui/icons-material";

const itemComments: ItemComment[] = [
    { id: 1, authorCip: "pele3157", authorFirstName: "Eliane", authorLastName: "Pelletier", content: "Cet article est-il toujours disponible ?", respondToCommentId: null, timeAgo: "il y a 2 jours" },
    { id: 2, authorCip: "herl2700", authorFirstName: "Leanne", authorLastName: "Héroux", content: "Et si je vous offre 2$ pour ce produit ?", respondToCommentId: null, timeAgo: "il y a 5 jours" },
    { id: 3, authorCip: "bela3439", authorFirstName: "Alex", authorLastName: "Lefkakis", content: "Je peux passer le chercher dans 6 ou 7 jours.", respondToCommentId: null, timeAgo: "il y a 1 semaine" },
    { id: 4, authorCip: "larj4236", authorFirstName: "Jean-Félix", authorLastName: "Larouche", content: "Oui", respondToCommentId: 1, timeAgo: "il y a 2 jours" },
    { id: 5, authorCip: "larj4236", authorFirstName: "Jean-Félix", authorLastName: "Larouche", content: "Je vous attendais et vous n'étiez pas là...", respondToCommentId: 3, timeAgo: "il y a 1 jours" },
];

export default function ItemDetails() {
    const { id } = useParams();
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [images, setImages] = useState<ItemImage[] | null>(null);
    const [item, setItem] = useState<DetailedItem | null>(null);
    const [imagesReady, setImagesReady] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const { isAuthenticated, token, logout } = useAuthSession();
    let navigate = useNavigate();

    const handleClick = () => {        
        try {
            createRoom({itemId: Number(id!), buyerCip: user!.cip, token}).then((data) => {
                navigate(`/message/${data!.roomId}`)
            });
        } catch(error) {
            console.error("Erreur lors de l'envoi du message : ", error);
            return;
        }

    };

    useEffect(() => {
        try {
            const response = fetchItem(id).then((data) => {
                setItem(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération de l'item :", error);
        }
        
        try {
            const response = fetchItemImages(id).then((data) => {
                setImages(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des images :", error);
        }
    }, [id]);

    useEffect(() => { 
        if (!images || images.length == 0) {
            setImages([]);
            setImagesReady(true);
            return;
        }
 
        const resolveImageUrls = async () => {
            try {
                const resolved = await Promise.all(
                    images.map(async (image) => {
                        const url = await fetchImage(image.guid);
                        return { ...image, url: url! };
                    })
                );
                setImages(resolved);
                setImagesReady(true);
            } catch (error) {
                console.error("Erreur lors de la récupération des images :", error);
            }
        };
 
        resolveImageUrls();
    }, [images?.length]);

    useEffect(() => {
        if (!item?.sellerCip) return;
        
        try {
            fetchUserStoreFront(item.sellerCip).then((data) => {
                setSeller(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du vendeur :", error);
        }
    }, [item?.sellerCip]);

    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        try {
            fetchUser({ token, logout }).then((data) => {
                setUser(data);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
    }, [isAuthenticated]);

    return ( seller == null || !imagesReady ?
        (<CenteredCircularProgress />) :
        (<Box sx={{ mx: "auto" }}>
            <Box sx={{ display: "flex", gap: 2, p: 2, alignItems: "flex-start" }}>
                <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    {images!.length === 0 && <Box role="img"
                        sx={{
                            height: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                            fontSize: 48,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>📷
                        </Box>}
                    {images!.length !== 0 && <ImageList images={images!}/>}
                    <Card sx={{ p: 2.5, borderRadius: 2 }}>
                        <CommentThread comments={itemComments} />
                    </Card>
                </Box>
                <Box  sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, margin: 2, alignItems: "center" }}>
                    <Box sx={{ width: "100%", flexShrink: 0, gap: 2, display: "flex", flexDirection: "column" }}>
                        <ItemMainInfoBox item={item} />
                        <Card sx={{ p: 2.5, borderRadius: 2 }}>
                            <Button variant="contained" sx={{ width: "100%", borderRadius: 2, minHeight: 48, backgroundColor: "#1d9e75" }} fullWidth onClick={handleClick}>Contacter le vendeur</Button>
                        </Card>                        
                        <SellerBox seller={seller} />
                        <ItemAditionnalInfoBox item={item} />
                    </Box>
                </Box>
            </Box>
        </Box>
        )
    );
}