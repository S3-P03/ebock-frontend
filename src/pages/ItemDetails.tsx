import { Box, Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser } from "interfaces/Seller";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser, fetchUserStoreFront } from "services/userService";
import { DetailedItem, ItemComment, ItemImage } from "interfaces/Item";
import { fetchItem, fetchItemImages, updateItem } from "services/itemService";
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
import { fetchReviewAverage, ReviewAverage } from "services/reviewService";
import { fetchComments, postComment } from "services/commentService";
import { CommentDetail } from "interfaces/Comment";
import ItemSellerOptionBox from "components/items/ItemSellerOptionBox";

export default function ItemDetails() {
    const { id } = useParams();
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [images, setImages] = useState<ItemImage[] | null>(null);
    const [item, setItem] = useState<DetailedItem | null>(null);
    const [imagesReady, setImagesReady] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [reviewAverage, setReviewAverage] = useState<ReviewAverage | null>(null);
    const { isAuthenticated, token, logout } = useAuthSession();
    const [comments, setComments] = useState<CommentDetail[]>([]);
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

    const handleOpenStorefront = () => {
        navigate(`/seller/${item?.sellerCip}`);
    }

    const loadComments = () => {
    fetchComments(id).then((data) => setComments(data ?? []));
    };

    useEffect(() => {
        fetchItem(id)
            .then((data) => {
                if (!data) {
                    navigate("/404");
                    return;
                }
                setItem(data);
            })
        
        fetchItemImages(id).then((data) => {
            setImages(data);
        });
    }, [id]);

    useEffect(() => { 
        if (!images || images.length == 0) {
            setImages([]);
            setImagesReady(true);
        }
        
        loadComments();
        
    }, [id]);

    useEffect(() => { 
        if (!images || images.length == 0) {
            setImages([]);
            setImagesReady(true);
            return;
        }
 
        const resolveImageUrls = async () => {
            const resolved = await Promise.all(
                images.map(async (image) => {
                    const url = await fetchImage(image.guid);
                    return { ...image, url: url! };
                })
            );
            setImages(resolved);
            setImagesReady(true);
        };
 
        resolveImageUrls();
    }, [images?.length]);

    useEffect(() => {
        if (!item?.sellerCip) return;
        
        fetchUserStoreFront(item.sellerCip).then((data) => {
            setSeller(data);
        });

        fetchReviewAverage(item?.sellerCip).then((data) => setReviewAverage(data)).catch(console.error);
    }, [item?.sellerCip]);

    useEffect(() => {
        if (!isAuthenticated || !token) return;
        
        fetchUser({ token, logout }).then((data) => {
            setUser(data);
        });
    }, [isAuthenticated]);

    var changeItemQuantity = (value: number) => {
        if (item) {
            setItem({ ...item, quantity: item.quantity - value });
            updateItem(item.itemId, token!, { quantity: item.quantity - value });
        }
    }

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
                        <CommentThread
                            isAuthenticated={isAuthenticated}
                            comments={comments}
                            isSeller={user?.cip === item?.sellerCip}
                            onCommentSubmitted={async (content, idParent) => {
                                const status = await postComment(id, content, idParent, token);
                                if (status === 200) loadComments();
                                return status;
                            }}
                        />
                    </Card>
                </Box>
                <Box  sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, margin: 2, alignItems: "center" }}>
                    <Box sx={{ width: "100%", flexShrink: 0, gap: 2, display: "flex", flexDirection: "column" }}>
                        <ItemMainInfoBox item={item} />
                        {isAuthenticated && <Card sx={{ p: 2.5, borderRadius: 2 }}>
                            {item && (user?.cip == item?.sellerCip ? 
                            (<ItemSellerOptionBox item={item} changeItemQuantity={changeItemQuantity} />) :
                            (<Button 
                                variant="contained" 
                                sx={{ width: "100%", borderRadius: 2, minHeight: 48, backgroundColor: "#1d9e75" }} 
                                fullWidth 
                                onClick={handleClick}>Contacter le vendeur</Button>)
                            )}
                        </Card>}                        
                        <SellerBox seller={seller} reviewAverage={reviewAverage} handleOpenStorefront={handleOpenStorefront} />
                        <ItemAditionnalInfoBox item={item} />
                    </Box>
                </Box>
            </Box>
        </Box>
        )
    );
}