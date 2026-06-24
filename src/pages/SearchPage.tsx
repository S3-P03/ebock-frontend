import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home with the same query params
    navigate(`/?${searchParams.toString()}`, { replace: true });
  }, [searchParams, navigate]);

  return null;
}
