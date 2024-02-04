import { useContext } from "react";
import { AlertContext, UseAlertContextType } from "../contexts/AlertContext";

export const useAlert = () => {
  return useContext<UseAlertContextType>(AlertContext);
};
