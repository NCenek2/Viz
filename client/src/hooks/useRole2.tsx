import { useContext } from "react";
import { Role2Context, UseRole2ContextType } from "../contexts/Role2Context";

const useRole2 = () => {
  return useContext<UseRole2ContextType>(Role2Context);
};

export default useRole2;
