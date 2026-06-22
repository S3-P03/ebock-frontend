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
import MenuBarLayout from "./components/MenuBarLayout";

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
              <Route path="/seller/:cip" element={<SellerProfile />} />
              <Route path="message/:id" element={<MessageRoom />} />
              <Route path="/item/:id" element={<ItemDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
