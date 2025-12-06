import { useState, useContext } from 'react';
import { Link, matchPath, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context Providers/AuthProvider';
import MessagesApp from '../Messages/MessagesApp/MessagesApp';
import MessagingApp from '../Messages2/MessagingApp/MessagingApp';
import UserProfile from '../Pages/ProfileOfPersons/UserProfile';
import Cart from '../Pages/Dashboard/Cart/Cart';
import BusinessProducts from '../Pages/BusinessProfile/MybusinessProducts/BusinessProducts';
import ProductForm from '../Pages/Dashboard/ProductForm/ProductForm';
import PurchaseHistory from '../Pages/Dashboard/Purchase History/PurchaseHistory';

const Dashboard = () => {
    const { user, loggOut } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Handle logout
    const handleLogOut = () => {
        loggOut()
            .then(() => { })
            .catch(error => console.log(error)); // Handling logout error
    };

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Define the routes and corresponding components
    const routes = [
        { path: '/dashboard/myprofile', component: <UserProfile /> },
        {path: '/dashboard/purchasehistory',component: <PurchaseHistory/>},
        { path: '/dashboard/cart', component: <Cart /> },
        { path: '/dashboard/messages', component: <MessagingApp user={user} /> },
        // Add other routes and components as needed
    ];

    // Find the component that matches the current location
    const currentRoute = routes.find(route => matchPath(route.path, location.pathname));

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
            {/* Toggle Button for Mobile */}
            <div className="md:hidden flex justify-between p-4 bg-purple-600 text-white">
                {/* Button to toggle sidebar visibility */}
                <button onClick={toggleSidebar} className="text-white focus:outline-none">
                    {sidebarOpen ? 'Close' : <span className='text-yellow-300'>| M | E | N | U |</span>}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`w-64 p-4 bg-purple-600 text-white transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">My-Self</h2>
                    <ul>
                        {/* Navigation links for user profile */}
                        <li className="mb-2"><Link to="/dashboard/myprofile" className="block hover:bg-purple-700 py-2 px-4 rounded">My Profile</Link></li>
                        {/* <li className="mb-2"><NavLink to="/dashboard/watchlist" className="block hover:bg-purple-700 py-2 px-4 rounded">Watchlist</NavLink></li> */}
                        <li className="mb-2"><NavLink to="/dashboard/purchasehistory" className="block hover:bg-purple-700 py-2 px-4 rounded">My Purchase History</NavLink></li>
                        <li className="mb-2"><NavLink to="/dashboard/cart" className="block hover:bg-purple-700 py-2 px-4 rounded">My Carts</NavLink></li>
                        <li className="mb-2"><NavLink to="/dashboard/messages" className="block hover:bg-purple-700 py-2 px-4 rounded text-yellow-300">Messages</NavLink></li>
                        {/* <li className="mb-2"><NavLink to="/dashboard/mybookings" className="block hover:bg-purple-700 py-2 px-4 rounded">My Bookings</NavLink></li> */}
                        {/* Conditional rendering for business profile link */}
                        {user?.haveBusiness && (
                            <li className="mb-2"><NavLink to="/dashboard/businessprofile" className="block hover:bg-purple-700 py-2 px-4 rounded">Go to Business Profile</NavLink></li>
                        )}
                    </ul>
                </div>
                <div>
                    <div className="divider divider-info"></div>
                    <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Main Navigation</h2>
                    <ul>
                        {/* Main navigation links */}
                        <li className="mb-2"><NavLink exact to="/" className="block hover:bg-purple-700 py-2 px-4 rounded">Home</NavLink></li>
                        <li className="mb-2">
                            {/* Search input for products */}
                            <input type="text" placeholder="Search Product" className="w-full py-2 px-4 rounded bg-purple-500 text-white focus:outline-none focus:bg-purple-400 focus:ring-2 focus:ring-purple-300" />
                        </li>
                        <li>
                            {/* Conditional rendering for user authentication */}
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
                                        <li className="text-center"><Link to='/createuser' className="block hover:bg-purple-700 py-2 px-4 rounded">Sign Up</Link></li>
                                        <li className="text-center"><Link to='/login' className="block hover:bg-purple-700 py-2 px-4 rounded">Log in</Link></li>
                                    </ul>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                {/* Conditionally render the matched component */}
                {currentRoute ? currentRoute.component : <div>Page Not Found</div>}
            </div>
            {/* <div>
                <ProductForm></ProductForm>
            </div> */}
        </div>
    );
};

export default Dashboard;


// const Dashboard = () => {
//     const { user, loggOut } = useContext(AuthContext);
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     // Handle logout
//     const handleLogOut = () => {
//         loggOut()
//             .then(() => { })
//             .catch(error => console.log(error)); // Handling logout error
//     };

//     // Toggle sidebar visibility
//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };

//     return (
//         <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
//             {/* Toggle Button for Mobile */}
//             <div className="md:hidden flex justify-between p-4 bg-purple-600 text-white">
//                 {/* Button to toggle sidebar visibility */}
//                 <button onClick={toggleSidebar} className="text-white focus:outline-none">
//                     {sidebarOpen ? 'Close' : <span className='text-yellow-300'>| M | E | N | U |</span>}
//                 </button>
//             </div>

//             {/* Sidebar */}
//             <div className={`w-64 p-4 bg-purple-600 text-white transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
//                 <div className="mb-8">
//                     <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">My-Self</h2>
//                     <ul>
//                         {/* Navigation links for user profile */}
//                         <li className="mb-2"><NavLink to="/dashboard/myprofile" className="block hover:bg-purple-700 py-2 px-4 rounded">My Profile</NavLink></li>
//                         <li className="mb-2"><NavLink to="/dashboard/watchlist" className="block hover:bg-purple-700 py-2 px-4 rounded">Watchlist</NavLink></li>
//                         <li className="mb-2"><NavLink to="/dashboard/purchasehistory" className="block hover:bg-purple-700 py-2 px-4 rounded">My Purchase History</NavLink></li>
//                         <li className="mb-2"><NavLink to="/dashboard/cart" className="block hover:bg-purple-700 py-2 px-4 rounded">My Carts</NavLink></li>
//                         <li className="mb-2"><NavLink to="/dashboard/messages" className="block hover:bg-purple-700 py-2 px-4 rounded text-yellow-300">Messages</NavLink></li>
//                         <li className="mb-2"><NavLink to="/dashboard/mybookings" className="block hover:bg-purple-700 py-2 px-4 rounded">My Bookings</NavLink></li>
//                         {/* Conditional rendering for business profile link */}
//                         {user?.haveBusiness && (
//                             <li className="mb-2"><NavLink to="/dashboard/businessprofile" className="block hover:bg-purple-700 py-2 px-4 rounded">Go to Business Profile</NavLink></li>
//                         )}
//                     </ul>
//                 </div>
//                 <div>
//                     <div className="divider divider-info"></div>
//                     <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">Main Navigation</h2>
//                     <ul>
//                         {/* Main navigation links */}
//                         <li className="mb-2"><NavLink exact to="/" className="block hover:bg-purple-700 py-2 px-4 rounded">Home</NavLink></li>
//                         <li className="mb-2">
//                             {/* Search input for products */}
//                             <input type="text" placeholder="Search Product" className="w-full py-2 px-4 rounded bg-purple-500 text-white focus:outline-none focus:bg-purple-400 focus:ring-2 focus:ring-purple-300" />
//                         </li>
//                         <li>
//                             {/* Conditional rendering for user authentication */}
//                             <div className="mt-4">
//                                 {user ? (
//                                     <ul className="space-y-2">
//                                         <li className="text-center text-yellow-300">{user?.displayName}</li>
//                                         <li className="text-center">
//                                             <button onClick={handleLogOut} className="btn text-sm p-0 md:text-sm text-white btn-ghost">
//                                                 <Link to="/">Log Out</Link>
//                                             </button>
//                                         </li>
//                                     </ul>
//                                 ) : (
//                                     <ul className="space-y-2">
//                                         <li className="text-center"><Link to='/createuser' className="block hover:bg-purple-700 py-2 px-4 rounded">Sign Up</Link></li>
//                                         <li className="text-center"><Link to='/login' className="block hover:bg-purple-700 py-2 px-4 rounded">Log in</Link></li>
//                                     </ul>
//                                 )}
//                             </div>
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 p-4">
//                 {/* Outlet for rendering nested routes */}
//                 <MessagingApp user={user.uid}/>
//             </div>
//         </div>
//     );
// };
// export default Dashboard;
