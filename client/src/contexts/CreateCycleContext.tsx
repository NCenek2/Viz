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

type MetricsCriteria = {
  metrics_id: number;
  weight: number;
  threshold: number;
};

type CreateCycleAction = {
  type: string;
  payload?: string | MetricsType | number | MetricsCriteria;
};

type CreateCycleState = {
  metrics: MetricsType[];
  criteria: MetricsCriteria[];
  users: Set<number>;
  date: string;
  cycle_id: number;
};

const initialCreateCycleState: CreateCycleState = {
  metrics: [],
  criteria: [],
  users: new Set<number>(),
  date: "",
  cycle_id: 0,
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

      const newMetrics = [...state.metrics, newMetric];

      return { ...state, metrics: newMetrics };
    }
    case CREATE_CYCLE_TYPE.REMOVE_METRIC: {
      if (!payload) throw new Error("Payload is undefined in ADD_METRIC");

      const oldMetric = payload as MetricsType;
      if (!oldMetric) throw new Error("Payload is not of type MetricsType");

      const newMetrics = state.metrics.filter(
        (metric) => metric.metrics_id !== oldMetric.metrics_id
      );

      return { ...state, metrics: newMetrics };
    }
    case CREATE_CYCLE_TYPE.ADD_USER: {
      if (!payload) throw new Error("Payload is undefined in ADD_USER");

      const newUser = payload as number;
      if (!newUser) throw new Error("Payload is not a number");

      const newUsers = state.users;
      newUsers.add(newUser);

      return { ...state, users: newUsers };
    }
    case CREATE_CYCLE_TYPE.REMOVE_USER: {
      if (!payload) throw new Error("Payload is undefined in ADD_USER");

      const oldUser = payload as number;
      if (!oldUser) throw new Error("Payload is not a number");

      const newUsers = state.users;
      newUsers.delete(oldUser);

      return { ...state, users: newUsers };
    }
    case CREATE_CYCLE_TYPE.SELECT_DATE: {
      if (!payload) throw new Error("Payload is undefined in SELECT_DATE");

      const newDate = payload as string;
      if (!newDate) throw new Error("Payload is not a string");

      return { ...state, date: newDate };
    }

    case CREATE_CYCLE_TYPE.HANDLE_NEXT: {
      const newCriteria: MetricsCriteria[] = state.metrics.map((metric) => {
        const { metrics_id } = metric;
        return { metrics_id, weight: 0, threshold: 0 };
      });
      return { ...state, criteria: newCriteria };
    }
    case CREATE_CYCLE_TYPE.EDIT_WEIGHT: {
      if (!payload) throw new Error("Payload is undefined in SELECT_DATE");

      const newCriteria = payload as MetricsCriteria;
      if (!newCriteria)
        throw new Error("Criteria is not of type MetricsCriteria");

      const newCriterias = state.criteria.map((crit) => {
        if (crit.metrics_id == newCriteria.metrics_id) {
          let weight = newCriteria.weight;
          return { ...crit, weight };
        }
        return crit;
      });
      return { ...state, criteria: newCriterias };
    }
    case CREATE_CYCLE_TYPE.EDIT_THRESHOLD: {
      if (!payload) throw new Error("Payload is undefined in SELECT_DATE");

      const newCriteria = payload as MetricsCriteria;
      if (!newCriteria)
        throw new Error("Criteria is not of type MetricsCriteria");

      const newCriterias = state.criteria.map((crit) => {
        if (crit.metrics_id == newCriteria.metrics_id) {
          let threshold = newCriteria.threshold;
          return { ...crit, threshold };
        }
        return crit;
      });

      return { ...state, criteria: newCriterias };
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
