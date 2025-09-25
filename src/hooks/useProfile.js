import { useQuery } from "@tanstack/react-query";
import { getProfileFromDB } from "../services/profiles";

export function useProfile(userId) {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryFn: () => getProfileFromDB(userId),
    queryKey: ["profile", userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return { profile: profile ?? null, profileLoading, profileError };
}
