import { create } from 'zustand';
import { getInfoAdmin } from '@/services/admin/admin';
import { permissionManager } from '@/utils/permissionManager';

interface AppState {
  currentUser?: any;
  setCurrentUser: (user: any) => void;
  roles: any[],
  setRoles: (roles: any[]) => void,
  loading: boolean;
  setLoading: (user: boolean) => void;
  fetchUserInfo: () => Promise<void>;
  clearUser: () => void;
  
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: undefined,
  setCurrentUser: (currentUser) => set({ currentUser }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  roles: [],
  setRoles: (roles) => set({ roles }),

  fetchUserInfo: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ currentUser: undefined, loading: false });
      return;
    }
    try {
      const response = await getInfoAdmin();
      const user: any = response.data;

      permissionManager.setUserPermissions(user?.permissions ?? []);
      set({ currentUser: user, loading: false});
    } catch (error) {
      console.error('Lỗi lấy thông tin user:', error);
      localStorage.removeItem('token');
      set({ currentUser: undefined, loading: false });
    }
  },

  clearUser: () => {
    localStorage.removeItem('token');
    // Clear permissions from permission manager
    permissionManager.clearPermissions();
    set({ currentUser: undefined });
  },
}));
