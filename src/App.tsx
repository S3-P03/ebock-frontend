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
import AddItem from "pages/AddItem";
import SearchPage from "pages/SearchPage";
import UserProfile from "./pages/UserProfile";
import NotFound from "pages/NotFound";
import { useEffect, useState } from "react";
import ApiErrorAlert from "components/ApiErrorAlert";
import AdminPage from "pages/AdminPage";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "./theme";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthSession();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent<{ error: string; status: number }>;
      setApiError(customEvent.detail.error ?? null);
      setApiStatus(customEvent.detail.status ?? null);
    };

    window.addEventListener("api_error", handleApiError as EventListener);

    return () => {
      window.removeEventListener("api_error", handleApiError as EventListener);
    };
  }, []);

  if (isLoading) { return <div className="spinner" />; }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppProvider>
            <ApiErrorAlert error={apiError} status={apiStatus} onClose={() => setApiError(null)} />
            <Router>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                    <Route path="/" element={<MenuBarLayout darkMode={darkMode} setDarkMode={setDarkMode} />} >
                        <Route index element={<Home />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/seller/:cip" element={<SellerProfile />} />
                        <Route path="/item/:id" element={<ItemDetails />} />
                        <Route element={<AuthRouteGuard />}>
                            <Route path="message/:id" element={<MessageRoom />} />
                            <Route path="message" element={<RoomHistory />} />
                            <Route path="/item/add" element={<AddItem />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/admin" element={<AdminPage />} />
                        </Route>
                    </Route>
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Router>
        </AppProvider>
    </ThemeProvider>
);
}
