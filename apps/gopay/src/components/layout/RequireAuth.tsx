import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [user, navigate, location.pathname]);

  if (!user) return null;
  return children;
}
