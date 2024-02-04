import { ReactNode, createContext, useState } from "react";

const useDashboardContext = () => {
  const [selectedCycle, setSelectedCycle] = useState(0);
  const [selectedUser, setSelectedUser] = useState(0);

  return {
    selectedCycle,
    setSelectedCycle,
    selectedUser,
    setSelectedUser,
  };
};

export type UseDashboardContext = ReturnType<typeof useDashboardContext>;

const initialDashboardContext: UseDashboardContext = {
  selectedCycle: 0,
  setSelectedCycle: () => {},
  selectedUser: 0,
  setSelectedUser: () => {},
};

export const DashboardContext = createContext<UseDashboardContext>(
  initialDashboardContext
);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const DashboardProvider = ({ children }: ChildrenType) => {
  return (
    <DashboardContext.Provider value={useDashboardContext()}>
      {children}
    </DashboardContext.Provider>
  );
};
