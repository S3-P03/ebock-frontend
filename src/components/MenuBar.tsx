import {
  AppBar,
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
import DefaultAvatar from "./DefaultAvatar";
import { jwtDecode } from "jwt-decode";
import { isRedactedEbockEnvironment, setRedactedEbockEnvironment } from "services/apiClient";
import titleImage from "../assets/title.png";

interface MenuBarProps {
    user: User | null;
}

export default function MenuBar({ user }: MenuBarProps) {
  const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
  const {token, logout} = useAuthSession();
  let navigate = useNavigate();

  const decodedToken: any = token ? jwtDecode(token) : null;
  const isAdmin = decodedToken?.realm_access.roles.includes("admin") ?? false;
  const isRedactedAllowed = decodedToken?.realm_access.roles.includes("dark") ?? false;

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
    navigate("/profile");
  }
  
  const handleAdmin = () => {
    setAnchorUserMenu(null);
    navigate("/admin");
  }

  const handleStorefront = () => {
    setAnchorUserMenu(null);
    navigate(`/seller/${user?.cip}`);
  }

  const handleMessages = () => {
    setAnchorUserMenu(null);
    navigate("/message");
  }

  const handleLogout = () => {
    logout();
  }

  const handleRedactedToggled = () => {
    if(!isRedactedAllowed) return;
    setRedactedEbockEnvironment(!isRedactedEbockEnvironment());
    window.location.reload();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container style={{ maxWidth: 3000}}>
          <Toolbar disableGutters sx={{ width: "100%", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={titleImage}
                alt="Logo"
                style={{ width: "40%", height: "100%", cursor: "pointer", objectFit: "contain" }}
                onClick={() => navigate("/search")}
              />
            </Box>
            {isRedactedAllowed && (
              <IconButton
                onClick={handleRedactedToggled}
                sx={{
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
                size="small"
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                />
              </IconButton>
            )}
            {user !== null ? (
              <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                <Button variant="contained" sx={{ mt: 0.5, mb: 0.5, mr: 2, textTransform: "none", borderRadius: 3, backgroundColor: "primary.main" }} onClick={handleAddItem}>
                    + Ajouter un item
                </Button>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Ouvrir options">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <DefaultAvatar
                        width={42}
                        height={42}
                        primaryColor={false}
                        initials={user?.firstName[0] + user?.lastName[0]}
                        fullName={user?.firstName + " " + user?.lastName}
                        profilePictureUrl={user?.profilePictureUrl}
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
                    <MenuItem onClick={handleStorefront}>Mon étalage</MenuItem>
                    <MenuItem onClick={handleMessages}>Messages</MenuItem>
                    {isAdmin && (
                      <MenuItem onClick={handleAdmin}>Admin - Tableau de bord</MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                  </Menu>
                </Box>
              </Box>
            ) : (
              <Box sx={{display: "flex", alignItems: "center", ml: "auto"}}>
                <Button variant="contained" sx={{ mt: 0.5, mb: 0.5, mr: 2, textTransform: "none", borderRadius: 3, backgroundColor: "primary.main" }} href="/login">
                  Se connecter
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
