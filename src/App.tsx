import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SellerProfile from "./pages/SellerProfile";
import { AppProvider } from "./context/AppContext";
import useAuthSession from "./hooks/useAuthSession";
import AuthRouteGuard from "./components/AuthRouteGuard";
import ItemDetails from "./pages/ItemDetails";
import MessageRoom from "./pages/MessageRoom";
import RoomHistory from "pages/RoomHistory";
import MenuBarLayout from "./components/MenuBarLayout";
import SearchPage from "pages/SearchPage";
import UserProfile from "./pages/UserProfile";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) { return <div className="spinner" />; }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route element={<AuthRouteGuard />}>
            <Route path="/" element={<MenuBarLayout />} >
              <Route index element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/seller/:cip" element={<SellerProfile />} />
              <Route path="message/:id" element={<MessageRoom />} />
              <Route path="message" element={<RoomHistory />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/user/:cip" element={<UserProfile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
