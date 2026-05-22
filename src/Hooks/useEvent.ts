// src/hooks/useEvents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

// 1. Definisikan Interface Sesuai Skema Prisma
export interface CategoryData {
  id: number; // Menggunakan Int di Prisma
  name: string;
}

export interface SpeakerData {
  id: number; // Menggunakan Int di Prisma
  name: string;
  role: string;
  image: string;
}

export interface EventData {
  id: number;          // @id @default(autoincrement()) -> Int
  name: string;        // String
  location: string;    // String
  dateEvent: string;   // DateTime di DB (diterima sebagai ISO String di FE)
  description: string; // Text
  categoryId: number;  // @map("category_id") -> Int
  speakerId: number;   // @map("speaker_id") -> Int
  
  // Properti relasi opsional (tergantung include dari backend Express)
  category?: CategoryData;
  speaker?: SpeakerData;
}

// 2. Hook untuk AMBIL SEMUA EVENT (Read)
export function useGetEvents() {
  return useQuery<EventData[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/events'); 
      return response.data;
    },
  });
}

// 3. Hook untuk TAMBAH EVENT (Create)
// Kita gunakan Omit untuk membuang 'id' karena ID di-generate otomatis oleh database (autoincrement)
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Omit<EventData, 'id'>) => {
      const response = await api.post('/events', newEvent);
      return response.data;
    },
    onSuccess: () => {
      // Otomatis refresh list event di UI tanpa reload halaman!
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// 4. Hook untuk HAPUS EVENT (Delete)
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => { // Tipe parameter diubah ke number mengikuti tipe ID Prisma
      const response = await api.delete(`/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}


// Tambahkan di bagian bawah src/hooks/useEvents.ts

// Hook untuk AMBIL DETAIL SATU EVENT (Read by ID)
export function useGetEventById(id: number) {
  return useQuery<EventData>({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data;
    },
    enabled: !!id, // Query hanya akan berjalan jika id valid (bukan 0 atau undefined)
  });
}

// Hook untuk UPDATE DATA EVENT (Update)
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: Omit<EventData, 'id'> }) => {
      const response = await api.put(`/events/${id}`, updatedData); // Menggunakan method PUT atau PATCH sesuai BE kamu
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Refresh list utama dan detail cache spesifik event ini agar datanya sinkron
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
}