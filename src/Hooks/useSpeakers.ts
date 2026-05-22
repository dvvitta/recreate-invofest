// src/hooks/useSpeakers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

export interface SpeakerData {
  id: number; // Menggunakan Int sesuai Prisma
  name: string;
  role: string;
  image: string; // URL string untuk foto profil
}

// 1. Hook untuk AMBIL SEMUA SPEAKERS (Read)
export function useGetSpeakers() {
  return useQuery<SpeakerData[]>({
    queryKey: ['speakers'],
    queryFn: async () => {
      const response = await api.get('/speakers'); 
      return response.data;
    },
  });
}

// 2. Hook untuk AMBIL DETAIL SATU SPEAKER (Read by ID)
export function useGetSpeakerById(id: number) {
  return useQuery<SpeakerData>({
    queryKey: ['speaker', id],
    queryFn: async () => {
      const response = await api.get(`/speakers/${id}`); // Endpoint detail pembicara kamu
      return response.data;
    },
    enabled: !!id, // Hanya berjalan jika ID valid (bukan 0 atau undefined)
  });
}

// 3. Hook untuk TAMBAH SPEAKER (Create)
export function useCreateSpeaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSpeaker: Omit<SpeakerData, 'id'>) => {
      const response = await api.post('/speakers', newSpeaker);
      return response.data;
    },
    onSuccess: () => {
      // Refresh list tabel pembicara di UI
      queryClient.invalidateQueries({ queryKey: ['speakers'] });
    },
  });
}

// 4. Hook untuk UPDATE DATA SPEAKER (Update)
export function useUpdateSpeaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: Omit<SpeakerData, 'id'> }) => {
      const response = await api.put(`/speakers/${id}`, updatedData); // Menggunakan PUT sesuai spesifikasi update BE
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Menyegarkan cache tabel utama dan detail data spesifik ID speaker ini
      queryClient.invalidateQueries({ queryKey: ['speakers'] });
      queryClient.invalidateQueries({ queryKey: ['speaker', variables.id] });
    },
  });
}

// 5. Hook untuk HAPUS SPEAKER (Delete)
export function useDeleteSpeaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/speakers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] });
    },
  });
}