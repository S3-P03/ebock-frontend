import { useEffect, useState } from "react";
import { User } from "interfaces/User";
import { Box, Card } from "@mui/material";
import useAuthSession from "hooks/useAuthSession";
import { fetchUser } from "services/userService";
import CenteredCircularProgress from "components/CenteredCircularProgress";
import ItemListFiltered from "components/items/ItemListFiltered";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const { token, logout } = useAuthSession();

  async function getUser() {
    setUser(await fetchUser({ token, logout }));
  };

  useEffect(() => {
    getUser();
  }, []);

  return ( user == null ?
    (<CenteredCircularProgress />) :
    (<Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card sx={{ p: 2, m: 2, flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>Bienvenue, {user?.firstName} {user?.lastName} !</h1>
      </Card>
      <ItemListFiltered />
    </Box>)
  );
}
