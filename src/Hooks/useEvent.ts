import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";

export interface CategoryData {
  id: number;
  name: string;
}

export interface SpeakerData {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface EventData {
  id: number;
  name: string;
  location: string;
  dateEvent: string;
  description: string;
  categoryId: number;
  speakerId: number;

  category?: CategoryData;
  speaker?: SpeakerData;
}

export function useGetEvents() {
  return useQuery<EventData[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/events");
      return response.data;
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Omit<EventData, "id">) => {
      const response = await api.post("/events", newEvent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useGetEventById(id: number) {
  return useQuery<EventData>({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: Omit<EventData, "id">;
    }) => {
      const response = await api.put(`/events/${id}`, updatedData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
  });
}
