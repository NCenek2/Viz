import axios from "../api/axios";
import useAuth from "./useAuth";
import useHandleError from "./useHandleError";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const handleError = useHandleError();

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });
      setAuth((prev: any) => {
        return { ...prev, accessToken: response.data.accessToken };
      });
    } catch (err: any) {
      handleError(err);
    }
  };

  return refresh;
};

export default useRefreshToken;
