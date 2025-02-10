import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TEmployee } from "schema/person";

interface IAuthStore {
  user: TEmployee | null;
  accessToken: string | null;
  isLogin: boolean | false;
}

interface IAuthStoreActions {
  setAuth: (data: any) => void;
  removeAuth: () => void;
}
const initialAuthStore: IAuthStore = {
  user: null,
  accessToken: null,
  isLogin: false,
};

export const useAuthStore = create(
  persist<IAuthStore & IAuthStoreActions>(
    (set) => ({
      ...initialAuthStore,
      setAuth: (data) =>
        set({
          user: data.employee,
          accessToken: data.token,
          isLogin: true,
        }),
      removeAuth: () => set(initialAuthStore),
    }),
    {
      name: "AuthStore",
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
