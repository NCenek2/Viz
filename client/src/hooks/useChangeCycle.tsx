import { useContext } from "react";
import {
  ChangeCycleContext,
  UseChangeCycleContext,
} from "../contexts/ChangeCycleContext";

const useChangeCycle = () => {
  return useContext<UseChangeCycleContext>(ChangeCycleContext);
};

export default useChangeCycle;
