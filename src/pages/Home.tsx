import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to search
    navigate('/search', { replace: true });
  }, [navigate]);

  return null;
}
