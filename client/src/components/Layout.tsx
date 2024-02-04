import { Outlet } from "react-router";
import Header from "./Header";
import Alert from "./Alert";

const Layout = () => {
  return (
    <>
      <Header />
      <Alert />
      <Outlet />
    </>
  );
};

export default Layout;
