import { useMutation } from "@tanstack/react-query";
import { authSignUp } from "../services/auth";

export function useSignUp() {
  const {
    mutate: signUp,
    isPending: signUpPending,
    isError: signUpError,
  } = useMutation({
    mutationFn: ({ email, password, dataObj }) =>
      authSignUp(email, password, dataObj),
  });

  return { signUp, signUpPending, signUpError };
}
