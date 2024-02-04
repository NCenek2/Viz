import { useAlert } from "./useAlert";
import useLogout from "./useLogout";

type ReturnError = {
  message: string;
  status: number;
};

const useHandleError = () => {
  const logout = useLogout();
  const { setAlert } = useAlert();

  function handleError(err: any): ReturnError {
    let error: ReturnError = { message: "Error", status: 500 };

    if (err?.response?.data?.message) {
      error = {
        message: err.response.data.message,
        status: parseInt(err.response.data.status) ?? 500,
      };
    } else if (err?.response?.status) {
      error = {
        message: err?.response?.statusText ?? "Error",
        status: parseInt(err?.response?.status) ?? 500,
      };
    } else {
      error = {
        message: err?.message ?? "Error",
        status: parseInt(err?.status) ?? 500,
      };
    }

    setAlert(error.message);
    if (error.status === 403) logout();
    return error;
  }

  return handleError;
};

export default useHandleError;
