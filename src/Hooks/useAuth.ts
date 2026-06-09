import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      // Hit endpoint login backend lo
      const response = await api.post<LoginResponse>("/auth/login", data);
      return response.data;
    },
  });
};

export const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/auth/users", getAuthConfig());
      return response.data;
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/auth/users/${id}`, getAuthConfig());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const response = await api.post("/auth/register", data, getAuthConfig());
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
export interface UpdateUserPayload {
  id: number | string;
  name: string;
  email: string;
  password?: string;
}

export const useGetUserById = (id: number | string | undefined) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await api.get(`/auth/users/${id}`, getAuthConfig());
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload) => {
      const response = await api.put(
        `/auth/users/${id}`,
        payload,
        getAuthConfig(),
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
};
