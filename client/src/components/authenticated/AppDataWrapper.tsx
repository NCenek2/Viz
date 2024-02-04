import { Outlet } from "react-router";
import { Role1Provider } from "../../contexts/Role1Context";
const AppDataWrapper = () => {
  return (
    <Role1Provider>
      <Outlet />
    </Role1Provider>
  );
};

export default AppDataWrapper;
