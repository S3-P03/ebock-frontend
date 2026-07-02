import {
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SellerUser } from "../interfaces/Seller";
import ProfileBox from "../components/ProfileBox";
import { fetchUser, fetchUserProfile, fetchUserStoreFront, updateUserPassword, updateUserProfile } from "../services/userService";
import Security from "../components/Security";
import UserInfo from "../components/UserInfo";
import { User, UserAddress, UserInformation} from "../interfaces/User";
import useAuthSession from "hooks/useAuthSession";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import { fetchReviewAverage, ReviewAverage } from "services/reviewService";

export default function AdminPage() {
    return (
        (<Box sx={{ mx: "auto", px: 10, py: 10 }}>
            <Box sx={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
            </Box>
        </Box>
        )
    );
}