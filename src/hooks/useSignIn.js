import { useMutation } from "@tanstack/react-query";
import { authSignInWithPassword } from "../services/auth";

export function useSignIn() {
  const {
    mutate: signIn,
    isPending: signInPending,
    isError: signInError,
  } = useMutation({
    mutationFn: ({ email, password }) =>
      authSignInWithPassword(email, password),
    mutationKey: ["auth", "signin"],
  });

  return { signIn, signInPending, signInError };
}
