import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authSignOut } from "../services/auth";
import toast from "react-hot-toast";

export function useSignOut() {
  const queryClient = useQueryClient();
  const {
    mutate: signOut,
    isPending,
    isError,
  } = useMutation({
    mutationFn: authSignOut,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "session"], null);
      toast.success("Signed out");
    },
  });
  return { signOut, isPending, isError };
}
