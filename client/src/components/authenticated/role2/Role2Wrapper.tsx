import { Outlet } from "react-router";
import { Role2Provider } from "../../../contexts/Role2Context";

const Role2Wrapper = () => {
  return (
    <Role2Provider>
      <Outlet />
    </Role2Provider>
  );
};

export default Role2Wrapper;
