import { createContext, ReactNode, useMemo, useReducer } from "react";
import { MetricsType } from "./Role2Context";

const CREATE_CYCLE_TYPE = {
  ADD_USER: "ADD_USER",
  REMOVE_USER: "REMOVE_USER",
  ADD_METRIC: "ADD_METRIC",
  REMOVE_METRIC: "REMOVE_METRIC",
  SELECT_DATE: "SELECT_DATE",
  HANDLE_NEXT: "HANDLE_NEXT",
  EDIT_WEIGHT: "EDIT_WEIGHT",
  EDIT_THRESHOLD: "EDIT_THRESHOLD",
  CREATE: "CREATE",
};

export type CreateCycleActionType = typeof CREATE_CYCLE_TYPE;

type MetricCriterionData = {
  metricId: number;
  weight: number;
  threshold: number;
};

type CreateCycleAction = {
  type: string;
  payload?: string | MetricsType | number | MetricCriterionData;
};

type CreateCycleState = {
  metrics: MetricsType[];
  criteria: MetricCriterionData[];
  users: Set<number>;
  startDate: string;
  cycleId: number;
};

const initialCreateCycleState: CreateCycleState = {
  metrics: [],
  criteria: [],
  users: new Set<number>(),
  startDate: "",
  cycleId: 0,
};

const createCycleReducer = (
  state: CreateCycleState,
  action: CreateCycleAction
) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CYCLE_TYPE.ADD_METRIC: {
      if (!payload) throw new Error("Payload is undefined in ADD_METRIC");

      const newMetric = payload as MetricsType;
      if (!newMetric) throw new Error("Payload is not of type MetricsType");

      const metrics = [...state.metrics, newMetric];

      return { ...state, metrics };
    }
    case CREATE_CYCLE_TYPE.REMOVE_METRIC: {
      if (!payload) throw new Error("Payload is undefined in ADD_METRIC");

      const oldMetric = payload as MetricsType;
      if (!oldMetric) throw new Error("Payload is not of type MetricsType");

      const metrics = state.metrics.filter(
        (metric) => metric.metricId !== oldMetric.metricId
      );

      return { ...state, metrics };
    }
    case CREATE_CYCLE_TYPE.ADD_USER: {
      if (!payload) throw new Error("Payload is undefined in ADD_USER");

      const user = payload as number;
      if (!user) throw new Error("Payload is not a number");

      const users = state.users;
      users.add(user);

      return { ...state, users };
    }
    case CREATE_CYCLE_TYPE.REMOVE_USER: {
      if (!payload) throw new Error("Payload is undefined in ADD_USER");

      const user = payload as number;
      if (!user) throw new Error("Payload is not a number");

      const users = state.users;
      users.delete(user);

      return { ...state, users };
    }
    case CREATE_CYCLE_TYPE.SELECT_DATE: {
      if (!payload) throw new Error("Payload is undefined in SELECT_DATE");

      const startDate = payload as string;
      if (!startDate) throw new Error("Payload is not a string");

      return { ...state, startDate };
    }

    case CREATE_CYCLE_TYPE.HANDLE_NEXT: {
      const criteria: MetricCriterionData[] = state.metrics.map((metric) => {
        const { metricId } = metric;
        return { metricId, weight: 0, threshold: 0 };
      });
      return { ...state, criteria };
    }
    case CREATE_CYCLE_TYPE.EDIT_WEIGHT: {
      if (!payload) throw new Error("Payload is undefined in SELECT_DATE");

      const criterion = payload as MetricCriterionData;
      if (!criterion)
        throw new Error("Criteria is not of type MetricCriterionData");

      const criteria = state.criteria.map((crit) => {
        if (crit.metricId == criterion.metricId) {
          let { weight } = criterion;
          return { ...crit, weight };
        }
        return crit;
      });
      return { ...state, criteria };
    }
    case CREATE_CYCLE_TYPE.EDIT_THRESHOLD: {
      if (!payload) throw new Error("Payload is undefined in SELECT_DATE");

      const criterion = payload as MetricCriterionData;
      if (!criterion)
        throw new Error("Criteria is not of type MetricCriterionData");

      const criteria = state.criteria.map((crit) => {
        if (crit.metricId == criterion.metricId) {
          let threshold = criterion.threshold;
          return { ...crit, threshold };
        }
        return crit;
      });

      return { ...state, criteria };
    }
    case CREATE_CYCLE_TYPE.CREATE: {
      return { ...initialCreateCycleState };
    }
    default:
      throw new Error("Type is not apart of the create cycle type");
  }
};

const useCreateCycleContext = (initCreateCycleState: CreateCycleState) => {
  const [state, dispatch] = useReducer(
    createCycleReducer,
    initCreateCycleState
  );

  const CREATE_CYCLE_ACTIONS = useMemo(() => {
    return CREATE_CYCLE_TYPE;
  }, []);

  return {
    state,
    dispatch,
    CREATE_CYCLE_ACTIONS,
  };
};

export type UseCreateCycleContextType = ReturnType<
  typeof useCreateCycleContext
>;

const useCreateCycleContextType: UseCreateCycleContextType = {
  state: initialCreateCycleState,
  dispatch: () => {},
  CREATE_CYCLE_ACTIONS: CREATE_CYCLE_TYPE,
};

export const CreateCycleContext = createContext<UseCreateCycleContextType>(
  useCreateCycleContextType
);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const CreateCycleProvider = ({ children }: ChildrenType) => {
  return (
    <CreateCycleContext.Provider
      value={useCreateCycleContext(initialCreateCycleState)}
    >
      {children}
    </CreateCycleContext.Provider>
  );
};
