import { useState, useContext } from 'react';
import { Link, matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context Providers/AuthProvider';
import './BusinessProfileDashboard.css';
import LoadingSpinner from '../../Shared Components/Spinner/LoadingSpinner';
// import MessagesApp from '../../Messages/MessagesApp/MessagesApp';
import MessagingApp from '../../Messages2/MessagingApp/MessagingApp';
// import MessagesList from '../../Messages/MessagesList/MessagesList';
import Reviews from '../Home/Reviews/Reviews';
import BusinessProfileForm from './BusinessProfileData/BusinessProfileForm';
import BusinessProducts from './MybusinessProducts/BusinessProducts';


const BusinessProfileDashboard = () => {
  const { user, loggOut, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    loggOut()
      .then(() => {
        navigate('/'); // Redirect to home page after logout
      })
      .catch(error => {
        console.log(error);
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
      {/* Toggle Button for Mobile */}
      <div className="md:hidden flex justify-between p-4 bg-blue-600 text-white">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {sidebarOpen ? 'Close' : <span className='text-yellow-300'>| M | E | N | U |</span>}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-64 p-4 bg-blue-600 text-white transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Business Dashboard</h2>
          <ul>
            <li className="mb-2"><Link to="/businessprofile/businessprofileform" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Business Profile</Link></li>
            <li className="mb-2"><Link to="/businessprofile/addproducts" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Products</Link></li>
            <li className="mb-2"><Link to="/businessprofile/soldproducts" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Sold Products</Link></li>
            {/* <li className="mb-2"><Link to="/businessprofile/analytics" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Analytics</Link></li> */}
            <li className="mb-2"><Link to="/businessprofile/messages" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Messages</Link></li>
            <li className="mb-2"><Link to="/businessprofile/orders" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Orders</Link></li>
            {/* <li className="mb-2"><Link to="/businessprofile/reviews" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Customer Reviews</Link></li> */}
          </ul>
        </div>
        <div>
          <div className="divider divider-info"></div>
          <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Main Navigation</h2>
          <ul>
            <li className="mb-2"><Link to="/" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Home</Link></li>
            <li className="mb-2">
              <input type="text" placeholder="Search Product" className="w-full py-2 px-4 rounded bg-blue-500 text-white focus:outline-none focus:bg-blue-400 focus:ring-2 focus:ring-blue-300" />
            </li>
            <li>
              <div className="mt-4">
                {user ? (
                  <ul className="space-y-2">
                    <li className="text-center text-yellow-300">{user?.displayName}</li>
                    <li className="text-center">
                      <button onClick={handleLogOut} className="btn text-sm p-0 md:text-sm text-white btn-ghost">
                        Log Out
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    <li className="text-center"><Link to='/createuser' className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Sign Up</Link></li>
                    <li className="text-center"><Link to='/login' className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Log in</Link></li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {loading ? (
          // <div className="flex justify-center items-center">
          //   <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          //     {/* <span className="visually-hidden">Loading...</span> */}
          //   </div>
          // </div>
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};
// const BusinessProfileDashboard = () => {
//   const { user, loggOut, loading } = useContext(AuthContext);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogOut = () => {
//       loggOut()
//           .then(() => {
//               navigate('/'); // Redirect to home page after logout
//           })
//           .catch(error => {
//               console.log(error);
//           });
//   };

//   const toggleSidebar = () => {
//       setSidebarOpen(!sidebarOpen);
//   };

//   return (
//       <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
//           {/* Toggle Button for Mobile */}
//           <div className="md:hidden flex justify-between p-4 bg-blue-600 text-white">
//               <button onClick={toggleSidebar} className="text-white focus:outline-none">
//                   {sidebarOpen ? 'Close' : <span className='text-yellow-300'>| M | E | N | U |</span>}
//               </button>
//           </div>

//           {/* Sidebar */}
//           <div className={`w-64 p-4 bg-blue-600 text-white transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
//               <div className="mb-8">
//                   <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Business Dashboard</h2>
//                   <ul>
//                       <li className="mb-2"><Link to="/businessprofile/businessprofileform" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Business Profile</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/addproducts" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Products</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/soldproducts" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Sold Products</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/messages" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Messages</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/analytics" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Analytics</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/orders" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Orders</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/reviews" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Customer Reviews</Link></li>
//                   </ul>
//               </div>
//               <div>
//                   <div className="divider divider-info"></div>
//                   <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Main Navigation</h2>
//                   <ul>
//                       <li className="mb-2"><Link to="/" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Home</Link></li>
//                       <li className="mb-2">
//                           <input type="text" placeholder="Search Product" className="w-full py-2 px-4 rounded bg-blue-500 text-white focus:outline-none focus:bg-blue-400 focus:ring-2 focus:ring-blue-300" />
//                       </li>
//                       <li>
//                           <div className="mt-4">
//                               {user ? (
//                                   <ul className="space-y-2">
//                                       <li className="text-center text-yellow-300">{user?.displayName}</li>
//                                       <li className="text-center">
//                                           <button onClick={handleLogOut} className="btn text-sm p-0 md:text-sm text-white btn-ghost">
//                                               Log Out
//                                           </button>
//                                       </li>
//                                   </ul>
//                               ) : (
//                                   <ul className="space-y-2">
//                                       <li className="text-center"><Link to='/createuser' className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Sign Up</Link></li>
//                                       <li className="text-center"><Link to='/login' className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Log in</Link></li>
//                                   </ul>
//                               )}
//                           </div>
//                       </li>
//                   </ul>
//               </div>
//           </div>

//           Main Content
//           <div className="flex-1 p-4">
//               {loading ? (
//                   <LoadingSpinner />
//               ) : (
//                   // <MessagesApp user={user} />
//                   <Outlet></Outlet>
//               )}
//           </div>
//       </div>
//   );
// };

// const BusinessProfileDashboard = () => {
//   const { user, loggOut, loading } = useContext(AuthContext);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogOut = () => {
//       loggOut()
//           .then(() => {
//               navigate('/'); // Redirect to home page after logout
//           })
//           .catch(error => {
//               console.log(error);
//           });
//   };

//   const toggleSidebar = () => {
//       setSidebarOpen(!sidebarOpen);
//   };

//   // Define the routes and corresponding components
//   const routes = [
//       { path: '/businessprofile/businessprofileform', component: <BusinessProfileForm /> },
//       { path: '/businessprofile/addproducts', component: <BusinessProducts /> },
//       // { path: '/businessprofile/soldproducts', component: <SoldProducts /> },
//       { path: '/businessprofile/messages', component: <MessagingApp /> },
//       // { path: '/businessprofile/analytics', component: <Analytics /> },
//       // { path: '/businessprofile/orders', component: <Orders /> },
//       { path: '/businessprofile/reviews', component: <Reviews /> },
//   ];

//   // Find the component that matches the current location
//   const currentRoute = routes.find(route => matchPath(route.path, location.pathname));

//   return (
//       <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
//           {/* Toggle Button for Mobile */}
//           <div className="md:hidden flex justify-between p-4 bg-blue-600 text-white">
//               <button onClick={toggleSidebar} className="text-white focus:outline-none">
//                   {sidebarOpen ? 'Close' : <span className='text-yellow-300'>| M | E | N | U |</span>}
//               </button>
//           </div>

//           {/* Sidebar */}
//           <div className={`w-64 p-4 bg-blue-600 text-white transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
//               <div className="mb-8">
//                   <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Business Dashboard</h2>
//                   <ul>
//                       <li className="mb-2"><Link to="/businessprofile/businessprofileform" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Business Profile</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/addproducts" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Products</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/soldproducts" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Sold Products</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/messages" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Messages</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/analytics" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Analytics</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/orders" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Orders</Link></li>
//                       <li className="mb-2"><Link to="/businessprofile/reviews" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Customer Reviews</Link></li>
//                   </ul>
//               </div>
//               <div>
//                   <div className="divider divider-info"></div>
//                   <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Main Navigation</h2>
//                   <ul>
//                       <li className="mb-2"><Link to="/" className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Home</Link></li>
//                       <li className="mb-2">
//                           <input type="text" placeholder="Search Product" className="w-full py-2 px-4 rounded bg-blue-500 text-white focus:outline-none focus:bg-blue-400 focus:ring-2 focus:ring-blue-300" />
//                       </li>
//                       <li>
//                           <div className="mt-4">
//                               {user ? (
//                                   <ul className="space-y-2">
//                                       <li className="text-center text-yellow-300">{user?.displayName}</li>
//                                       <li className="text-center">
//                                           <button onClick={handleLogOut} className="btn text-sm p-0 md:text-sm text-white btn-ghost">
//                                               Log Out
//                                           </button>
//                                       </li>
//                                   </ul>
//                               ) : (
//                                   <ul className="space-y-2">
//                                       <li className="text-center"><Link to='/createuser' className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Sign Up</Link></li>
//                                       <li className="text-center"><Link to='/login' className="block hover:bg-blue-700 py-2 px-4 rounded transition duration-300">Log in</Link></li>
//                                   </ul>
//                               )}
//                           </div>
//                       </li>
//                   </ul>
//               </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 p-4">
//               {loading ? (
//                   <LoadingSpinner />
//               ) : (
//                   // Conditionally render the matched component
//                   currentRoute ? currentRoute.component : <div>Page Not Found</div>
//               )}
//           </div>
//       </div>
//   );
// };

export default BusinessProfileDashboard;
