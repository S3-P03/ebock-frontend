import { useEffect, useState } from "react";
import { User } from "../interfaces/User";
import { Box, Card } from "@mui/material";
import MenuBar from "../components/MenuBar";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import useAuthSession from "../hooks/useAuthSession";

export default function Home() {
  
  const { apiAddress } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const { token } = useAuthSession();
  const navigate = useNavigate();

  async function getUser() {
    const requestData = await fetch(apiAddress + "/api/user/me",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );
    if (requestData.status === 401) {
      navigate("/login");
      return;
    }
    try {
      const data = (await requestData.json()) as User;
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MenuBar user={user}/>
      <Card sx={{ p: 2, m: 2, flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>Bienvenue, {user?.firstName} {user?.lastName} !</h1>
      </Card>
    </Box>
  );
}
