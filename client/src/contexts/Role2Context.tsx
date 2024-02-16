import { ReactNode, createContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useHandleError from "../hooks/useHandleError";

export type UsersType = {
  userId: number;
  email: string;
  role: number;
};

export type MetricsType = {
  metricId: number;
  metricName: string;
  metricUnit: string;
};

type Role2State = {
  users: UsersType[];
  metrics: MetricsType[];
};

const initialRole2State: Role2State = {
  users: [],
  metrics: [],
};

const useRole2Context = (initRole2State: Role2State) => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const [users, setUsers] = useState(initRole2State.users);
  const [metrics, setMetrics] = useState(initRole2State.metrics);

  async function refreshRole2() {
    try {
      const usersResponse = await axiosPrivate("/users/access");
      let usersData: UsersType[] = usersResponse.data;
      usersData.sort((userA, userB) => userA.userId - userB.userId);

      const metricsResponse = await axiosPrivate.get("/metrics");
      let metricsData: MetricsType[] = metricsResponse.data;
      metricsData.sort(
        (metricA, metricB) => metricA.metricId - metricB.metricId
      );
      setUsers(usersData);
      setMetrics(metricsData);
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    refreshRole2();
  }, []);

  return {
    users,
    setUsers,
    metrics,
    setMetrics,
    refreshRole2,
  };
};

export type UseRole2ContextType = ReturnType<typeof useRole2Context>;

const initialRole2ContextType: UseRole2ContextType = {
  users: initialRole2State.users,
  setUsers: () => {},
  metrics: initialRole2State.metrics,
  setMetrics: () => {},
  refreshRole2: async () => {},
};

export const Role2Context = createContext<UseRole2ContextType>(
  initialRole2ContextType
);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const Role2Provider = ({ children }: ChildrenType) => {
  return (
    <Role2Context.Provider value={useRole2Context(initialRole2State)}>
      {children}
    </Role2Context.Provider>
  );
};
