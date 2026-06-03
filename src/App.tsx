import { useEffect, useState } from "react";
import "./App.css";

type User = {
  prenom: string;
  nom: string;
};

const Logout = () => {
  console.log("déconnexion");
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fakeUser = {
      prenom: "Bob",
      nom: "LeBricoleur",
    };
    setUser(fakeUser);
  }, []);

  /*useEffect(() => {
    fetch("http://localhost:8888/api/user/me")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Erreur:", error));
  }, []);*/

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="user-section">
          <div className="avatar">
            {user.prenom.charAt(0)}
          </div>

          <div>
            <h3>
              {user.prenom} {user.nom}
            </h3>
          </div>
        </div>
        <div className="bottom">
          <button className="logoutButton" onClick = {Logout}> deconnexion </button>
        </div>
      </aside>

      <main className="content">
        <h1>Bonjour {user.prenom}</h1>
      </main>
    </div>
    
  );
}