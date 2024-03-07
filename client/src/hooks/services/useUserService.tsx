import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import useHandleError from "../useHandleError";
import { useAlert } from "../useAlert";
import { FormData } from "../../components/Register";
import { ROUTE_PREFIX } from "../../constants/constants";
import useAxiosPrivate from "../useAxiosPrivate";
import useRole2 from "../useRole2";
import { ResetInfo } from "../../components/ResetPassword";
import { UsersType } from "../../contexts/Role2Context";

const useUserService = () => {
  const handleError = useHandleError();
  const navigate = useNavigate();
  const { setAlert, hideAlert } = useAlert();
  const axiosPrivate = useAxiosPrivate();
  const { refreshRole2 } = useRole2();
  const location = useLocation();
  const from = location?.state?.from?.pathname || `${ROUTE_PREFIX}/login`;

  async function getUsers(): Promise<UsersType[]> {
    try {
      const usersResponse = await axiosPrivate("/users/access");
      let usersData: UsersType[] = usersResponse.data;
      usersData.sort((userA, userB) => userA.userId - userB.userId);
      return usersData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  const register = async (data: FormData) => {
    hideAlert();
    try {
      const result = await axios({
        url: "/register",
        method: "post",
        data,
      });

      if (result?.status === 201) {
        setAlert("Account Created", "success");
        navigate(`${ROUTE_PREFIX}/login`);
      }
    } catch (err) {
      handleError(err);
    }
  };

  async function changeAccess(isAdmin: boolean, userId: number, email: string) {
    const role = isAdmin ? 2 : 1;
    hideAlert();
    try {
      await axiosPrivate({
        url: `/users/access/${userId}`,
        method: "patch",
        data: { role },
      });
      await refreshRole2();
      if (isAdmin === true) {
        setAlert(`Admin permissions given to ${email}`, "success");
      } else {
        setAlert(`Removed permissions from ${email}`, "success");
      }
    } catch (err) {
      handleError(err);
    }
  }

  async function resetPassword(resetInfo: ResetInfo) {
    hideAlert();
    try {
      const response = await axios({
        url: "/profile/reset-password",
        method: "post",
        data: resetInfo,
      });

      if (response?.status === 204) {
        setAlert("Password Reset", "success");
        navigate(from);
      }
    } catch (err) {
      handleError(err);
    }
  }

  return { getUsers, register, changeAccess, resetPassword };
};

export default useUserService;
