// src/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

export interface CategoryData {
  id: number; 
  name: string;
}

// 1. Hook untuk AMBIL SEMUA KATEGORI (Read)
export function useGetCategories() {
  return useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories'); // Sesuaikan dengan endpoint BE kamu
      return response.data;
    },
  });
}

// 2. Hook untuk TAMBAH KATEGORI (Create)
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCategory: Omit<CategoryData, 'id'>) => {
      const response = await api.post('/categories', newCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// 3. Hook untuk HAPUS KATEGORI (Delete)
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Tambahkan di bagian bawah src/hooks/useCategories.ts

// Hook untuk AMBIL DETAIL SATU KATEGORI (Read by ID)
export function useGetCategoryById(id: number) {
  return useQuery<CategoryData>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await api.get(`/categories/${id}`); // Endpoint detail kategori kamu
      return response.data;
    },
    enabled: !!id, // Hanya jalan jika ID valid (bukan 0/undefined)
  });
}

// Hook untuk UPDATE DATA KATEGORI (Update)
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: Omit<CategoryData, 'id'> }) => {
      const response = await api.put(`/categories/${id}`, updatedData); // Menggunakan PUT sesuai BE kamu
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Segarkan cache tabel list utama dan cache spesifik ID kategori ini
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}