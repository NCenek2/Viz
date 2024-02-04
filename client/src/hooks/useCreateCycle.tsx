import { useContext } from "react";
import {
  CreateCycleContext,
  UseCreateCycleContextType,
} from "../contexts/CreateCycleContext";

export const useCreateCycle = () => {
  return useContext<UseCreateCycleContextType>(CreateCycleContext);
};
