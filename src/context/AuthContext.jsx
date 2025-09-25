import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthStateChange } from "../services/auth";

import { upsertProfileFromSession } from "../services/profiles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false); // flips to true on INITIAL_SESSION

  useEffect(() => {
    const off = onAuthStateChange((event, nextSession) => {
      setSession(nextSession ?? null);
      qc.setQueryData(["auth", "session"], nextSession ?? null);

      if (event === "INITIAL_SESSION") {
        setReady(true);
      }

      if (
        nextSession?.user &&
        (event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED")
      ) {
        const userId = nextSession.user.id;
        upsertProfileFromSession(nextSession.user)
          .then(() => {
            qc.invalidateQueries({
              queryKey: ["profile", userId],
            });
          })
          .catch((err) => {
            console.error("ensureProfile failed", err);
          });
      }

      if (event === "SIGNED_OUT") {
        qc.removeQueries({ queryKey: ["profile"] });
      }
    });

    return () => off();
  }, [qc]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthReady: ready,
    }),
    [session, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext being used outside AuthProvider");
  return ctx;
}
