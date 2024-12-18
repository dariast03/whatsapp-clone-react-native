import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import mmkvMiddleware from "../lib/storage/midleware"


type IUser = {
    nose: string
}

type IResponseLogin = {
    data: any
}

export type LoginStatus =
  | "authenticated"
  | "no-authenticated"
  | "guest"
  | "pending"
  | null;

type Store = {
  status: LoginStatus;
  user: IUser;
  token: string | null;
  isRefresing: boolean;

};

type LoginData = IResponseLogin["data"];

type Actions = {
  setUser: (user: IUser) => void;
  setLogin: (data: LoginData) => void;
  setLogout: () => void;
  setToken: (token: string) => void;
};

type AuthStore = Store & Actions;

const initialState: Store = {
  status: "pending",
  isRefresing: false,
  token: null,
  user: {} as any,

};

const storeData: StateCreator<Store & Actions> = (set) => ({
  ...initialState,
  setUser: (user) => set((state) => ({ ...state, user })),
  setLogin: (data) =>
    set((state) => ({
      user: data.usuario,
      token: data.token,
      status: "authenticated",
    })),
  setLogout: () => set(() => ({ ...initialState, status: "no-authenticated" })),
  setToken: (token) => set((state) => ({ ...state, token })),
});

export const useAuthStore = create<AuthStore>()(
  persist(storeData, {
    name: "authStore",
    storage: mmkvMiddleware,
    //partialize: ({ token, user }) => ({ token, user }),
  })
);
