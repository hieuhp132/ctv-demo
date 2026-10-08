import Navbar from "../pages/navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import NavbarV1 from "../pages/navbar/NavbarV1.jsx";
import Footer from "./Footer.jsx";
export default function Layout({ children }) {
  return (
    <>
      {/* <Navbar /> */}
      <NavbarV1/>
      <main>
        <Outlet />
      </main>
    </>
  );
}
