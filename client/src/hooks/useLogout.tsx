import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  async function logout() {
    try {
      await axios.get("/logout");
      setAuth(null);
    } catch (err) {
      setAuth(null);
    }
  }

  return logout;
};

export default useLogout;
