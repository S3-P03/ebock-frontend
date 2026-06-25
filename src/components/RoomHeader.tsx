import { ArrowLeft } from "@mui/icons-material";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { Room } from "interfaces/Message";
import { useNavigate } from "react-router-dom";

export default function RoomHeader({room, connectedCip} : {room : Room, connectedCip : string}) {
    const navigate = useNavigate();

    const back = () => {
        navigate("/message")
    };

    return(
        <Box sx={{ flexGrow: 1, position: "static" }}>
            <Container style={{ maxWidth: 3000}}>
                <Box sx={{display:"flex", alignItems: "center"}}>
                    <IconButton
                    onClick={(back)}
                    sx={{mr: 2}}
                    >
                        <ArrowLeft/>
                    </IconButton>
                    <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        mr: 2,
                        display: "flex",
                        flexGrow: 1,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                    >
                    {room.itemName} - {connectedCip!==room.sellerCip ? room.sellerFirstName : room.buyerFirstName} {connectedCip!==room.sellerCip ? room.sellerLastName: room.buyerLastName}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}