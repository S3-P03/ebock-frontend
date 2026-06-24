import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { User } from "interfaces/User";
import useAuthSession from "hooks/useAuthSession";
import { useNavigate } from "react-router-dom";

export default function MenuBar({ user }: { user: User | null }) {
  const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
  const {logout} = useAuthSession();
  let navigate = useNavigate();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null);
  };

  const handleAddItem = () => {
    navigate("/item/add");
  }

  const handleProfile = () => {
    setAnchorUserMenu(null);
  }

  const handleMessages = () => {
    setAnchorUserMenu(null);
    navigate("/message");
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container style={{ maxWidth: 3000}}>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/search"
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
              EBOCK
            </Typography>
            <Button variant="contained" sx={{ mt: 0.5, mb: 0.5, mr: 4, textTransform: "none", borderRadius: 3, backgroundColor: "#1d9e75" }} onClick={handleAddItem}>
                + Ajouter un item
            </Button>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Ouvrir options">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.firstName + " " + user?.lastName}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorUserMenu}    
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorUserMenu)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfile}>Profil</MenuItem>
                <MenuItem onClick={handleMessages}>Messages</MenuItem>
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
