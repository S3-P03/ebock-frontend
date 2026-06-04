import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AppProvider } from "./context/AppContext";
import useAuthSession from "./hooks/useAuthSession";
import AuthRouteGuard from "./components/AuthRouteGuard";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) { return <div className="spinner" />; }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route element={<AuthRouteGuard />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
