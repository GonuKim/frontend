import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NavbarController = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith("/Memorize/");

  return showNavbar ? <Navbar /> : null;
};
export default NavbarController;
