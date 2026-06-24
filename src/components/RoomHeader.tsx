import { Box, Container, Typography } from "@mui/material";
import { Room } from "interfaces/Message";

export default function RoomHeader({room, connectedCip} : {room : Room, connectedCip : string}) {
    return(
        <Box sx={{ flexGrow: 1, position: "static" }}>
            <Container style={{ maxWidth: 3000}}>
                <Typography
                variant="h6"
                noWrap
                component="a"
                href=""
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
                <Box sx={{ flexGrow: 0 }}>
                </Box>
            </Container>
        </Box>
    );
}