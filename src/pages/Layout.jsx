import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import { useAuthContext } from "../context/AuthContext";
import LoadingFull from "../ui/LoadingFull";
import { useProfile } from "../hooks/useProfile";

export default function Layout() {
  const { user, isAuthReady } = useAuthContext();
  const userId = user?.id ?? null;
  const { data: profile } = useProfile(userId);
  const role = profile?.role ?? null;

  if (!isAuthReady) return <LoadingFull />;

  return (
    <>
      <Navigation user={user} role={role} />
      <main className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-6">
        <Outlet />
      </main>
    </>
  );
}
