import { useState, createContext, ReactNode, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useUserMetricService from "../hooks/services/useUserMetricService";

export type DashboardResultsType = {
  userMetricId: number;
  userMetricValue: number;
  metricId: number;
  metricName: string;
  metricUnit: string;
  startDate: string;
  weight: number;
  threshold: number;
};

const useDashboardResultsContext = (userId = 0, cycleId = 0) => {
  const { auth } = useAuth();
  const [dashboardResults, setDashboardResults] = useState<
    DashboardResultsType[]
  >([]);
  const { getCycleUserMetrics } = useUserMetricService();
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const [updatedSet, setUpdatedSet] = useState(new Set<number>());

  if (userId === 0) {
    userId = auth?.userInfo?.userId ?? userId;
  }

  async function refreshDashboard() {
    const userCycleMetricsData = await getCycleUserMetrics(userId, cycleId);
    setDashboardResults(userCycleMetricsData);
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return {
    dashboardResults,
    setDashboardResults,
    madeChanges,
    setMadeChanges,
    updatedSet,
    setUpdatedSet,
    refreshDashboard,
  };
};

export type UseDashboardResultsContextType = ReturnType<
  typeof useDashboardResultsContext
>;

const useDashboardResultsContextType: UseDashboardResultsContextType = {
  dashboardResults: [],
  setDashboardResults: () => {},
  madeChanges: false,
  setMadeChanges: () => {},
  updatedSet: new Set<number>(),
  setUpdatedSet: () => {},
  refreshDashboard: async () => {},
};

export const DashboardResultsContext =
  createContext<UseDashboardResultsContextType>(useDashboardResultsContextType);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

type DashboardResultsProviderProps = {
  userId?: number;
  cycleId?: number;
};

export const DashboardResultsProvider = ({
  children,
  userId,
  cycleId,
}: ChildrenType & DashboardResultsProviderProps) => {
  return (
    <DashboardResultsContext.Provider
      value={useDashboardResultsContext(userId, cycleId)}
    >
      {children}
    </DashboardResultsContext.Provider>
  );
};
