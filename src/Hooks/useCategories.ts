import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

export interface CategoryData {
  id: number; 
  name: string;
}

export function useGetCategories() {
  return useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories'); 
      return response.data;
    },
  });
}

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

export function useGetCategoryById(id: number) {
  return useQuery<CategoryData>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await api.get(`/categories/${id}`); 
      return response.data;
    },
    enabled: !!id, 
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: Omit<CategoryData, 'id'> }) => {
      const response = await api.put(`/categories/${id}`, updatedData); 
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}