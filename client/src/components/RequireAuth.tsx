import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTE_PREFIX } from "../constants/constants";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth ? (
    <Outlet />
  ) : (
    <Navigate to={`${ROUTE_PREFIX}/login`} state={{ from: location }} replace />
  );
};

export default RequireAuth;
