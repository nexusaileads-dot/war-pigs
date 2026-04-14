import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  photoUrl?: string;
  profile: {
    level: number;
    xp: number;
    currentPigs: number;
    totalPigsEarned: number;
    equippedCharacterId: string | null;
    equippedWeaponId: string | null;
  };
}

interface GameState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  equipItem: (type: 'character' | 'weapon', id: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  initAuth: async () => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg?.initData) {
        // Dev mode - use mock
        if (import.meta.env.DEV) {
          // Create mock session
          const mockToken = localStorage.getItem('dev_token');
          if (mockToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
            const { data } = await axios.get(`${API_URL}/api/auth/me`);
            set({ user: data.user, token: mockToken, isLoading: false });
            return;
          }
        }
        set({ isLoading: false });
        return;
      }

      const { data } = await axios.post(`${API_URL}/api/auth/telegram`, {
        initData: tg.initData
      });

      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error) {
      console.error('Auth failed:', error);
      set({ isLoading: false });
    }
  },

  refreshProfile: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`);
      set({ user: data.user });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  },

  equipItem: async (type, id) => {
    const { token } = get();
    if (!token) return;

    try {
      await axios.post(`${API_URL}/api/inventory/equip`, {
        [type === 'character' ? 'characterId' : 'weaponId']: id
      });
      await get().refreshProfile();
    } catch (error) {
      console.error('Failed to equip item:', error);
    }
  }
}));
  
