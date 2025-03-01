import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LoginCredentials {
  username: string;
  password: string;
}

export function useAuth() {
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
      queryClient.setQueryData(["/api/user"], null);
    },
  });

  return {
    user,
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPERADMIN",
    isSuperAdmin: user?.role === "SUPERADMIN",
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}
