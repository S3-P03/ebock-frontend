import { useEffect, useState } from "react";
import { User } from "../interfaces/User";
import { Box, Card } from "@mui/material";
import MenuBar from "../components/MenuBar";

export default function Home() {
  const Logout = () => {
    console.log("déconnexion");
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fakeUser = {
      prenom: "Bob",
      nom: "LeBricoleur",
    };
    setUser(fakeUser);
  }, []);

  /*useEffect(() => {
    fetch("/api/user/me")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Erreur:", error));
  }, []);*/

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MenuBar user={user}/>
      <Card sx={{ p: 2, m: 2, flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>Bienvenue, {user.prenom} {user.nom} !</h1>
      </Card>
    </Box>
  );
}
