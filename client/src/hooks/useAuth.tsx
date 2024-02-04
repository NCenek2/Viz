import { useContext } from "react";
import AuthContext, { UseAuthContextType } from "../contexts/AuthContext";

const useAuth = () => {
  return useContext<UseAuthContextType>(AuthContext);
};

export default useAuth;
