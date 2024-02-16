import { ReactNode, createContext, useState } from "react";

type User = {
  userId: number;
  username: string;
  email: string;
  role: number;
};

export type AuthState = {
  userInfo: User;
  accessToken: string;
} | null;

const initialAuthState: AuthState = null;

const useAuthContext = (initAuthState: AuthState) => {
  const [auth, setAuth] = useState(initAuthState);
  return { auth, setAuth };
};

export type UseAuthContextType = ReturnType<typeof useAuthContext>;

const useAuthContextType: UseAuthContextType = {
  auth: initialAuthState,
  setAuth: () => {},
};

export const AuthContext =
  createContext<UseAuthContextType>(useAuthContextType);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const AuthProvider = ({ children }: ChildrenType) => {
  return (
    <AuthContext.Provider value={useAuthContext(initialAuthState)}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
