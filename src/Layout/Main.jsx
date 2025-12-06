// import React from 'react';

import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Pages/Shared/Footer/Footer";
import Navbar from "../Pages/Shared/NavBar/Navbar";
import './Styles/Main.css';

// const Main = () => {
//     return (
//         <div className="bg-yellow-100">
//             <NavbarWithRouteControl></NavbarWithRouteControl>
//             {/* <Navbar></Navbar> */}
//             <Outlet></Outlet>
//             <Footer></Footer>
//         </div>
//     );
// };

const Main = () => {
  return (
    <div className="bg-yellow-100 min-h-screen flex flex-col">
      <NavbarWithRouteControl />
      <div className="flex-grow pt-0">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const NavbarWithRouteControl = () => {
  const location = useLocation();
  const { pathname } = location;

  // Check if the current route matches the /products/:location/:searchValue pattern
  const isProductDetailPage = pathname.startsWith('/products/');
  //   console.log(isProductDetailPage);

  // Render the navbar only if shouldHideNavBar is false
  return <Navbar hideSearch={isProductDetailPage} />;
};


export default Main;