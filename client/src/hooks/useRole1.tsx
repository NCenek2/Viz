import { useContext } from "react";
import { Role1Context, UseRole1ContextType } from "../contexts/Role1Context";

const useRole1 = () => {
  return useContext<UseRole1ContextType>(Role1Context);
};

export default useRole1;
