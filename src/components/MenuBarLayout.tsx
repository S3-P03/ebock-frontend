import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthSession from 'hooks/useAuthSession';
import { User } from 'interfaces/User';
import { fetchUser } from 'services/userService';
import MenuBar from './MenuBar';

interface MenuBarLayoutProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

export default function MenuBarLayout({ darkMode, setDarkMode }: MenuBarLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const { token, logout, isAuthenticated } = useAuthSession();

  async function getUser() {
    setUser(await fetchUser({ token, logout }));
  };

  useEffect(() => {
    if(isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated]);
  
  return (
    <div>
      {isAuthenticated && <MenuBar user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
      {!isAuthenticated && <MenuBar user={null} darkMode={darkMode} setDarkMode={setDarkMode} />}
      <main>
        <Outlet /> {}
      </main>
    </div>
  );
}