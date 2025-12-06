import {
  createBrowserRouter,
  // RouterProvider,
} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
// import Order from "../Pages/Order/Order/Order/Order";
// import AllProducts from "../Pages/Collections/AllProducts/AllProducts";
import CategoryTypes from "../Pages/CategoryTypes/CategoryTypes";
import Login from "../Pages/Log in/Login";
import SignUp from "../Pages/SignUp/SignUp";
import SearchedProducts from "../Pages/Shared/NavBar/Searched Products/SearchedProducts";
// import Navbar from "../Pages/Shared/NavBar/Navbar";
// import PrivateRouts from "./PrivateRouts";
import Dashboard from "../Layout/Dashboard";
import Cart from "../Pages/Dashboard/Cart/Cart";
import BusinessProfileDashboard from "../Pages/BusinessProfile/BusinessProfileDashboard";
import BusinessProfileForm from "../Pages/BusinessProfile/BusinessProfileData/BusinessProfileForm";
import UserProfile from "../Pages/ProfileOfPersons/UserProfile";
import BusinessProducts from "../Pages/BusinessProfile/MybusinessProducts/BusinessProducts";
import MessagesApp from "../Messages/MessagesApp/MessagesApp";
import MessagingApp from "../Messages2/MessagingApp/MessagingApp";
import PurchaseHistory from "../Pages/Dashboard/Purchase History/PurchaseHistory";
import ProductSuccess from "../Pages/ProductSuccess/ProductSuccess";
// import MessagesList from "../Messages/MessagesList/MessagesList";
// import Messageprofile from "../Messages3/Messageprofile";
// import BMessages from "../Pages/BusinessProfile/Business Messages/bMessages";
// import BMessages from "../Pages/BusinessProfile/Business Messages/bMessages";
// import MessagesApp from ""; // Ensure this path is correct

// Mock authUser and product data for MessagesApp
// const authUser = {
//   uid: '12345',
//   name: 'John Doe',
//   email: 'johndoe@example.com'
// };

// const product = {
//   userId: '67890',
//   name: 'Product Name',
//   email: 'buyer@example.com',
//   id: 'product123'
// };

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: 'category',
        element: <CategoryTypes></CategoryTypes>
      },
      {
        path: '/products/:location/:searchValue',
        element: <SearchedProducts></SearchedProducts>
      },
      // {
      //   // path: 'products',
      //   // element: <AllProducts></AllProducts>
      // },
      // {
      //   // path: 'order',
      //   // element: <PrivateRouts><Order></Order></PrivateRouts>
      // },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'createuser',
        element: <SignUp></SignUp>
      }
    ]
  },
  {
    path:'dashboard',
    element:<Dashboard></Dashboard>,
    children:[
      {
        path: '/dashboard/myprofile',
        element:<UserProfile></UserProfile>
      },
      {
        path: '/dashboard/cart',
        element: <Cart></Cart>
      },
      {
        path: "/dashboard/messages",
        element:<MessagingApp></MessagingApp>
        // element:<MessagesApp></MessagesApp>
        // element: <Messageprofile></Messageprofile>
      },
      {
        path:"/dashboard/purchasehistory",
        element: <PurchaseHistory></PurchaseHistory>
      },
    ]
  },
  {
    path:'businessprofile',
    element:<BusinessProfileDashboard></BusinessProfileDashboard>,
    children:[
      {
        path:'/businessprofile/businessprofileform',
        element:<BusinessProfileForm></BusinessProfileForm>
      },
      {
        path:"/businessprofile/addproducts",
        element:<BusinessProducts></BusinessProducts>
      },
      {
        path: "/businessprofile/messages",
        element:<MessagingApp></MessagingApp>
      }
    ]
  },
  {
    path: "/payment/suuccess/:trans_id",
    element:<ProductSuccess></ProductSuccess>
  }
]);
