import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser } from "interfaces/Seller";
import { SellerItem } from "interfaces/Item";
import ProfileBox from "components/ProfileBox";
import ItemDisplayBox from "components/items/ItemDisplayBox";
import ReviewRow from "components/ReviewRow";
import { useParams } from "react-router-dom";
import { fetchUserStoreFront } from "services/userService";
import { fetchUserItems } from "services/itemService";
import { fetchReviewAverage, fetchReviewDetails, ReviewAverage, ReviewDetail } from "services/reviewService";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import AddReviewForm from "components/AddReviewForm";
import { postReview } from "services/reviewService";
import useAuthSession from "hooks/useAuthSession";

export default function SellerProfile() {
    const { cip } = useParams();
    const [seller, setSeller] = useState<SellerUser | null>(null);
    const [items, setItems] = useState<SellerItem[] | null>(null);
    const [reviewAverage, setReviewAverage] = useState<ReviewAverage | null>(null);
    const [reviews, setReviews] = useState<ReviewDetail[]>([]);
    const { token } = useAuthSession();

    const loadReviews = () => {
        fetchReviewAverage(cip).then((data) => setReviewAverage(data))
        fetchReviewDetails(cip).then((data) => setReviews(data ?? []))
    };

    useEffect(() => {
        fetchUserStoreFront(cip).then((data) => setSeller(data))
        fetchUserItems(cip).then((data) => setItems(data))
        loadReviews();
    }, [cip]);

    if (seller == null) return <CenteredCircularProgress />;

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

                <Box sx={{ width: 220, flexShrink: 0 }}>
                    <ProfileBox seller={seller} reviewAverage={reviewAverage} itemsOnSaleCount={items?.length ?? null} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <ItemDisplayBox items={items ?? []} />
                    <AddReviewForm onReviewSubmitted={async (content, rating) => {
                        const status = await postReview(cip, content, rating, token);
                        if (status === 200) loadReviews();
                        return status;
                    }} />

                    {reviews.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
                                Avis ({reviewAverage?.nbrReviews ?? 0})
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {reviews.map((review, index) => (
                                    <ReviewRow key={index} review={review} />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>

            </Box>
        </Box>
    );
}