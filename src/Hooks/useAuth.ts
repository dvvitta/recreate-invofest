import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance"; 

// Interface data user
export interface User {
  id: number;
  name: string;
  email: string;
}

// Interface payload untuk login (bisa dikirim dari react-hook-form)
export interface LoginPayload {
  email: string;
  password: string;
}

// Interface response sukses dari backend Railway lo
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Helper untuk mengambil token JWT dari localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token"); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==========================================
// 1. Hook untuk Login ke API Railway (BARU)
// ==========================================
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      // Hit endpoint login backend lo
      const response = await api.post<LoginResponse>("/auth/login", data);
      return response.data; 
    },
  });
};

// ==========================================
// 2. Hook untuk Mengambil Semua Data User
// ==========================================
export const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/auth/users", getAuthConfig());
      return response.data; 
    },
  });
};

// ==========================================
// 3. Hook untuk Menghapus User Berdasarkan ID
// ==========================================
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/auth/users/${id}`, getAuthConfig());
    },
    onSuccess: () => {
      // Refresh otomatis daftar user setelah berhasil dihapus
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Tambahkan interface ini untuk payload create user di useAuth.ts
export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
}

// ==========================================
// 4. Hook untuk Membuat User Baru di DB Railway (TAMBAHKAN INI)
// ==========================================
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      // Hit endpoint register/create user baru ke backend Railway lo
      // Biasanya antara "/auth/register" atau "/auth/users" tergantung endpoint backend lo
      const response = await api.post("/auth/register", data, getAuthConfig());
      return response.data;
    },
    onSuccess: () => {
      // Refresh cache query "users" otomatis agar di halaman UserIndex datanya langsung muncul yang paling baru
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// ... kode lo yang lama ...

export interface UpdateUserPayload {
  id: number | string;
  name: string;
  email: string;
  password?: string;
}

// ==========================================
// 5. Hook untuk Mengambil Detail 1 User Berdasarkan ID (BARU)
// ==========================================
export const useGetUserById = (id: number | string | undefined) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      // Pastikan endpoint ini sesuai dengan backend lo (misal: /auth/users/:id atau /users/:id)
      const response = await api.get(`/auth/users/${id}`, getAuthConfig());
      return response.data;
    },
    enabled: !!id, // Query hanya akan jalan jika ID tersedia di URL
  });
};

// ==========================================
// 6. Hook untuk Mengupdate Data User di DB Railway (BARU)
// ==========================================
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload) => {
      // Mengirimkan data perubahan via PUT ke server Railway lo
      const response = await api.put(`/auth/users/${id}`, payload, getAuthConfig());
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Refresh list users dan detail user spesifik ini di cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
};