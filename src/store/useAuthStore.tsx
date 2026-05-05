import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    isAunthenticated: boolean;
    user: string | null;
    login: (username: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAunthenticated: false,
            user: null,
            login: (username: string) =>
                set(() => ({
                    isAunthenticated: true,
                    user: username,
                })),
            logout: () =>
                set(() => ({
                    isAunthenticated: false,
                    user: null,
                })),
        }),
        {
            name: "auth-storage",
        }
    )
);