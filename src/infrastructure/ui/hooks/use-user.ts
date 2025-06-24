import { getCurrentUser } from "@/domain/services/user/user.service";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
    staleTime: Infinity,
  });

  return user;
};
