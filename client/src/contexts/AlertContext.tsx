import { createContext, ReactNode, useCallback, useState } from "react";

type AlertType = "danger" | "warning" | "success";

let timeout: NodeJS.Timeout | null = null;

const useAlertContext = () => {
  const [alert, setAle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("danger");

  const setAlert = useCallback(
    (message: string, type: AlertType = "danger") => {
      setAlertType(type);
      setShowAlert(true);
      setAle(message);
      timeout = setTimeout(() => {
        hideAlert();
      }, 4000);
    },
    []
  );

  const hideAlert = useCallback(() => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    setShowAlert(false);
    setAle("");
  }, []);

  return { alertType, alert, setAlert, hideAlert, showAlert };
};

export type UseAlertContextType = ReturnType<typeof useAlertContext>;

const initialAlertContext: UseAlertContextType = {
  alertType: "danger",
  alert: "",
  showAlert: false,
  setAlert: () => {},
  hideAlert: () => {},
};

export const AlertContext =
  createContext<UseAlertContextType>(initialAlertContext);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const AlertProvider = ({ children }: ChildrenType) => {
  return (
    <AlertContext.Provider value={useAlertContext()}>
      {children}
    </AlertContext.Provider>
  );
};
