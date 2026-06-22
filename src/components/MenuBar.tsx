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
import { User } from "../interfaces/User";
import useAuthSession from "../hooks/useAuthSession";

export default function MenuBar({ user }: { user: User | null }) {
  const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
  const {logout} = useAuthSession();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null);
  };

  const handleProfile = () => {
    setAnchorUserMenu(null);
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
              href="/"
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
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
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
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
