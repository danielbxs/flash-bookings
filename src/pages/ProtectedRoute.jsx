import { Navigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import LoadingFull from "../ui/LoadingFull";
import { useProfile } from "../hooks/useProfile";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthReady, user } = useAuthContext();
  const userId = user?.id ?? null;
  const { profile, profileLoading } = useProfile(userId);
  const role = profile?.role ?? null;

  if (!isAuthReady || profileLoading) return <LoadingFull label="Loading..." />;
  if (!user) return <Navigate to="/auth/signin" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}
