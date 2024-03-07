import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTE_PREFIX } from "../constants/constants";

type RequireRoleProps = {
  roleLimit: number;
};

const RequireRole = ({ roleLimit }: RequireRoleProps) => {
  const { auth } = useAuth();
  const role = auth?.userInfo?.role ?? 0;

  return role >= roleLimit ? (
    <Outlet />
  ) : (
    <Navigate to={`${ROUTE_PREFIX}/unauthorized`} replace />
  );
};

export default RequireRole;
