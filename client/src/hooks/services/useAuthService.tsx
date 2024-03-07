import { AuthState } from "../../contexts/AuthContext";
import { LoginInfo } from "../../components/Login";
import useAuth from "../useAuth";
import useHandleError from "../useHandleError";
import { useAlert } from "../useAlert";
import { useLocation, useNavigate } from "react-router";
import { ROUTE_PREFIX } from "../../constants/constants";
import axios from "../../api/axios";

const useAuthService = () => {
  const { setAuth } = useAuth();
  const handleError = useHandleError();
  const { hideAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();

  const login = async (loginInfo: LoginInfo) => {
    const from = location?.state?.from?.pathname || `${ROUTE_PREFIX}/rankings`;
    hideAlert();

    try {
      const response = await axios({
        url: "/auth/login",
        method: "post",
        data: loginInfo,
      });

      const authData: AuthState = response.data;
      if (response?.status === 200) {
        setAuth(authData);
        navigate(from, { replace: true });
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { login };
};

export default useAuthService;
