import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import mmkvMiddleware from "../lib/storage/midleware"


type Store = {
 chatName: string;
 chatImage: string;
};


type Actions = {
  setChatName: (name: string) => void;
    setChatImage: (image: string) => void;
    setChat(name: string, image: string): void;
};

type AuthStore = Store & Actions;

const initialState: Store = {
    chatName: "Chat",
    chatImage: "",

};

const storeData: StateCreator<Store & Actions> = (set) => ({
  ...initialState,
    setChatName: (name) => set((state) => ({ ...state, chatName: name })),
    setChatImage: (image) => set((state) => ({ ...state, chatImage: image })),
    setChat: (name, image) => set((state) => ({ ...state, chatName: name, chatImage: image })),
});

export const useChatStore = create<AuthStore>()(
    storeData
);
