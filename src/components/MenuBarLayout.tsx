import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthSession from 'hooks/useAuthSession';
import { User } from 'interfaces/User';
import { fetchUser } from 'services/userService';
import MenuBar from './MenuBar';

export default function MenuBarLayout() {
  const [user, setUser] = useState<User | null>(null);
  const { token, logout } = useAuthSession();

  async function getUser() {
    setUser(await fetchUser({ token, logout }));
  };

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <div>
      <MenuBar user={user} />
      <main>
        <Outlet /> {}
      </main>
    </div>
  );
}