import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { queryClient } from "../../../index";
import { AdminType } from "../../../types/types";

interface AuthContextType {
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  adminId: string | null;
  setAdminId: Dispatch<SetStateAction<string | null>>;
  logoutAdmin: () => void;
  setAdminData: Dispatch<SetStateAction<AdminType | undefined>>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  setIsAuth: () => {},
  adminId: null,
  setAdminId: () => {},
  logoutAdmin: () => {},
  setAdminData: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<AdminType>();

  const logoutAdmin = () => {
    localStorage.setItem("billAppAuthToken", "");
    queryClient.setQueryData(["billAppAuthToken"], null);
    setIsAuth(false);
    setAdminId(null);
  };
  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        adminId,
        setAdminId,
        setAdminData,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
