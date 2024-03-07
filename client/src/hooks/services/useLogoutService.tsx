import axios from "../../api/axios";
import useAuth from "../useAuth";

const useLogoutService = () => {
  const { setAuth } = useAuth();

  async function logout() {
    try {
      await axios.get("/logout");
    } catch (err) {
    } finally {
      setAuth(null);
    }
  }

  return { logout };
};

export default useLogoutService;
