import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";

export interface SpeakerData {
  id: number;
  name: string;
  role: string;
  image: string;
}

export function useGetSpeakers() {
  return useQuery<SpeakerData[]>({
    queryKey: ["speakers"],
    queryFn: async () => {
      const response = await api.get("/speakers");
      return response.data;
    },
  });
}

export function useGetSpeakerById(id: number) {
  return useQuery<SpeakerData>({
    queryKey: ["speaker", id],
    queryFn: async () => {
      const response = await api.get(`/speakers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateSpeaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSpeaker: Omit<SpeakerData, "id">) => {
      const response = await api.post("/speakers", newSpeaker);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
  });
}

export function useUpdateSpeaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: Omit<SpeakerData, "id">;
    }) => {
      const response = await api.put(`/speakers/${id}`, updatedData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
      queryClient.invalidateQueries({ queryKey: ["speaker", variables.id] });
    },
  });
}

export function useDeleteSpeaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/speakers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
  });
}
