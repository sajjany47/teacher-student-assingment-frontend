import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "./Login";
import Navbar from "../component/Navbar";

const Layout = () => {
  const auth = useSelector((state) => state.auth);

  if (!auth.token) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
