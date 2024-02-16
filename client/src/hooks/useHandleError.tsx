import { useAlert } from "./useAlert";
import useLogout from "./useLogout";

type ReturnError = {
  message: string;
  statusCode: number;
};

const useHandleError = () => {
  const logout = useLogout();
  const { setAlert } = useAlert();

  function handleError(err: any): ReturnError {
    let message = "Error";
    let statusCode = 500;

    if (err?.response?.data?.message) {
      message = err.response.data.message;
      if (Array.isArray(message) && message.length > 0) {
        message = message[0];
      }
      statusCode = err?.response?.data?.statusCode;
    } else if (err?.response?.status) {
      message = err?.response?.statusText;
      statusCode = err.response.status;
    } else {
      message = err?.message;
      statusCode = err?.status;
    }

    message ??= "Error";
    statusCode ??= 500;

    setAlert(message);
    if (statusCode === 403) logout();
    return { message, statusCode };
  }

  return handleError;
};

export default useHandleError;
