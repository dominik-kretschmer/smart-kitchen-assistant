import { defineStore } from 'pinia';

export interface UserState {
  userId: number | null;
  username: string;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: null,
    username: '',
    isLoggedIn: false,
  }),
  actions: {
    setUser(userId: number, username: string) {
      this.userId = userId;
      this.username = username;
      this.isLoggedIn = true;
      this.saveToLocalStorage();
    },
    clearUser() {
      this.userId = null;
      this.username = '';
      this.isLoggedIn = false;
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: this.userId,
          username: this.username,
          isLoggedIn: this.isLoggedIn,
        }),
      );
    },
    loadFromLocalStorage() {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          this.userId = userData.userId;
          this.username = userData.username;
          this.isLoggedIn = userData.isLoggedIn;
        } catch (error) {
          console.error('Failed to parse user data from localStorage', error);
          this.clearUser();
        }
      }
    },
    initUser() {
      this.loadFromLocalStorage();
    },
  },
  getters: {
    getUserId: (state) => state.userId,
    getUsername: (state) => state.username,
    getIsLoggedIn: (state) => state.isLoggedIn,
  },
});
