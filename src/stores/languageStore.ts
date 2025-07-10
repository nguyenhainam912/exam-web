import { create } from "zustand";
import i18n from "@/config/i18n";

interface LanguageState {
    language: string;
    setLanguage: (lng: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: i18n.language || "vi",
  setLanguage: (lng) => {
      i18n.changeLanguage(lng); 
      set({ language: lng });
  },
}));