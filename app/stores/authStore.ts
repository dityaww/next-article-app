import { create } from "zustand"
import { persist } from "zustand/middleware"

type Role = "Admin" | "User" | null

type AuthState = {
    token: string | null;
    role: Role;
    setAuth: (token: string, role: Role) => void;
    clearAuth: () => void;
}

type ProfileState = {
    username: string | null;
    role: Role;
    clearProfile: () => void;
    setProfile: (username: string, role: Role) => void
}


export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            setAuth: (token, role) => set({ token, role }),
            clearAuth: () => set({ token: null, role: null }),
        }),
        {
            name: "auth",
        }
    )
)

export const getProfile = create<ProfileState>()(
    persist(
        (set) => ({
            username: null,
            role: null,
            setProfile: (username, role) => set({ username, role }),
            clearProfile: () => set({ username: null, role: null }),
        }),
        {
            name: "profiles",
        }
    )
)
