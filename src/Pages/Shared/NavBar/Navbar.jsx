import { useContext, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { AuthContext } from "../../../Context Providers/AuthProvider";
import useLocationPermit from "../../../hooks/useLocationPermit";
import useCart from "../../../hooks/useCart";
import LoadingSpinner from "../../../Shared Components/Spinner/LoadingSpinner";
// import "./NavBar.css";
// import SearchedProducts from "./Searched Products/SearchedProducts";

// const Navbar = ({ hideSearch }) => {
//     const { user, loggOut, loading } = useContext(AuthContext);
//     const handleLogOut = () => {
//         loggOut()
//             .then(() => { })
//             .catch(error => console.log(error));
//     }
//     // console.log(user);
//     //////ordercart
//     const [cart] = useCart();
//     // console.log(cart.length);

//     const { location, error } = useLocationPermit();
//     // const location==null?{latitude:0, longitude:0}:location;
//     const [searchValue, setSearchValue] = useState('');
//     const handleSearchResult = () => {
//         document.getElementById('input-field').value = "";
//         // history.push('/products/:location/:searchValue');
//         console.log(history);
//         window.location.reload();
//     };
//     const handleSearchedText = (event) => {
//         // event.preventdefault();
//         setSearchValue(event.target.value);
//     }
//     return (
//         <>
//             <div className="navbar border rounded-sm fixed max-w-screen-xl items-center z-20 opacity-60 bg-gray-900 text-yellow-300">
//                 <div className="navbar-start bg-gray-900">
//                     <div className="dropdown">
//                         <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
//                         </div>
//                         <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-800 rounded-box w-60">
//                             <li><a className="hover:bg-black hover:text-lg hover:text-yellow-300"><Link to='/'>Home</Link></a></li>
//                             <li><a className="hover:bg-black hover:text-lg hover:text-yellow-300"><Link to='/category'>Category</Link></a></li>
//                             {/* <li><a className="hover:bg-black hover:text-lg hover:text-yellow-300"><Link to='/products'>Products</Link></a></li> */}
//                             {/* <li><a className="hover:bg-black hover:text-lg hover:text-yellow-300"><Link to='/dashboard/cart'>Order</Link></a></li> */}

//                             <li><a className="hover:text-lg text-sm hover:bg-amber-500"><Link to='/dashboard/cart'><button className="btn">
//                                 Orders
//                                 <div className="badge bg-amber-500 text-white text-sm">+{cart.length}</div>
//                             </button></Link></a></li>
//                             {user ? <div className="dropdown dropdown-end">
//                                 <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                                     <div className="w-10 rounded-full">
//                                         <img src={user.photoURL} alt="" />
//                                         {/* <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
//                                     </div>
//                                 </div>
//                                 <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black opacity-50 rounded-box w-52">
//                                     <li>
//                                         <div className="form-control">
//                                             <label className="label cursor-pointer">
//                                                 <span className="text-teal-50"><Link to="/dashboard/myprofile">My Profile</Link></span>
//                                                 <input type="radio" name="radio-10" className="ml-2 radio checked:bg-red-500" checked />
//                                             </label>
//                                         </div>
//                                         <div className="form-control">
//                                             <label className="label cursor-pointer">
//                                                 <span className="text-teal-50"><Link to='/businessprofile/businessprofileform'>Business Profile</Link></span>
//                                                 <Link to='/businessprofile/businessprofileform'><input type="radio" name="radio-10" className="ml-2 radio checked:bg-blue-500" /></Link>
//                                             </label>
//                                         </div>
//                                     </li>
//                                     <li><a className="hover:bg-black text-base hover:text-lg hover:text-yellow-500">Settings</a></li>
//                                     <li className="p-2"><a>
//                                         {
//                                             // user ? <>
//                                             <button onClick={handleLogOut} className="btn text-lg hover:bg-yellow-100 hover:pb-10 hover:text-sm hover:text-black btn-ghost">{user?.displayName} :-Log Out</button>
//                                             // </> : <ul className="flex gap-4">
//                                             // <li><a className="hover:bg-black text-sm hover:text-lg hover:text-yellow-300"><Link to='/createuser'>Sign Up</Link></a></li>
//                                             // <li><a className="hover:bg-black text-sm hover:text-lg hover:text-yellow-300"><Link to='/login'>Log in</Link></a></li>
//                                             // </ul>
//                                         }
//                                     </a></li>
//                                 </ul>
//                             </div> : <ul>
//                                 <li><a className="hover:bg-black hover:text-lg hover:text-yellow-300"><Link to='/createuser'>Sign Up</Link></a></li>
//                                 <li><a className="hover:bg-black hover:text-lg hover:text-yellow-300"><Link to='/login'>Log in</Link></a></li>
//                             </ul>
//                             }
//                         </ul>
//                     </div>
//                     <div className="d-flex border border-red-500 rounded-xl p-3">
//                         <h1 className="btn btn-ghost md:text-4xl mb-0"><Link to={"/"}>NearYou</Link></h1>
//                         <p className="text-center mt-0">Find here!</p>
//                     </div>
//                     <div className="ml-4 sm:w-auto">
//                         {
//                             !hideSearch &&
//                             <label className="input input-bordered h-8 w-44 hover:bg-yellow-100 flex items-center md:gap-2 sm:gap-1">
//                                 <input id="input-field" onChange={handleSearchedText} type="text" className="grow text-black text-sm" placeholder="Search" />
//                                 <Link to={`/products/${encodeURIComponent(JSON.stringify(location))}/${searchValue}`}><svg onClick={() => handleSearchResult} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg></Link>
//                                 {/* <svg onClick={handleSearchResult} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg> */}
//                             </label>

//                         }
//                     </div>
//                     {/* <a className="btn btn-ghost text-xl">NearYou</a> */}
//                 </div>
//                 <div className="navbar-end w-full hidden lg:flex">
//                     <ul className="menu flex-row pr-0">
//                         <li><a className="hover:bg-black text-sm hover:text-lg hover:text-yellow-300"><Link to='/'>Home</Link></a></li>
//                         <li><a className="hover:bg-black text-sm hover:text-lg hover:text-yellow-300"><Link to='/category'>Category</Link></a></li>
//                         {/* <li><a className="hover:text-lg hover:bg-black"><Link to='/products'>Products</Link></a></li> */}
//                         <li><a className=""><Link to='/dashboard/cart'><button className="btn hover:text-sm hover:bg-black hover:text-white">
//                             Orders
//                             <div className="badge bg-amber-500 text-white text-sm">+{cart.length}</div>
//                         </button></Link></a></li>
//                     </ul>
//                     {loading ? (
//                         <LoadingSpinner></LoadingSpinner>
//                     ) : user ? (
//                         <div className="dropdown dropdown-end">
//                             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                                 <div className="w-10 rounded-full">
//                                     <img src={user.photoURL} alt="" />
//                                     {/* <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
//                                 </div>
//                             </div>
//                             <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black opacity-50 rounded-box w-52">
//                                 <li>
//                                     <div className="form-control">
//                                         <label className="label cursor-pointer">
//                                             <span className="text-teal-50"><Link to="/dashboard/myprofile">My Profile</Link></span>
//                                             <input type="radio" name="radio-10" className="ml-2 radio checked:bg-red-500" checked />
//                                         </label>
//                                     </div>
//                                     <div className="form-control">
//                                         <label className="label cursor-pointer">
//                                             <span className="text-teal-50"><Link to='/businessprofile/businessprofileform'>Business Profile</Link></span>
//                                             <Link to='/businessprofile/businessprofileform'><input type="radio" name="radio-10" className="ml-2 radio checked:bg-blue-500" /></Link>
//                                         </label>
//                                     </div>
//                                 </li>
//                                 <li><a className="hover:bg-black text-base hover:text-lg hover:text-yellow-500">Settings</a></li>
//                                 <li className="p-2"><a>
//                                     <button onClick={handleLogOut} className="btn text-lg hover:bg-yellow-100 hover:pb-10 hover:text-sm hover:text-black btn-ghost">{user?.displayName} :-Log Out</button>
//                                 </a></li>
//                             </ul>
//                         </div>
//                     ) : (
//                         <ul className="flex gap-4">
//                             <li><a className="hover:bg-black text-lg hover:text-lg hover:text-yellow-500"><Link to='/createuser'>Sign Up</Link></a></li>
//                             <li><a className="hover:bg-black text-lg hover:text-lg hover:text-yellow-500"><Link to='/login'>Log in</Link></a></li>
//                         </ul>
//                     )}
//                 </div>
//                 {/* <div className="">
//                     {
//                         error === null && <SearchedProducts
//                             location={location}
//                             searchValue={searchValue}
//                         />
//                     }
//                 </div> */}
//             </div>
//         </>
//     );
// };

const Navbar = ({ hideSearch }) => {
    const { user, loggOut, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogOut = () => {
        loggOut()
            .then(() => { })
            .catch(error => console.log(error));
    }

    const [cart] = useCart();
    const { location } = useLocationPermit();
    const [searchValue, setSearchValue] = useState('');

    const handleSearchResult = (event) => {
        if (event.key === 'Enter' || event.type === 'click') {
            // console.log("Search triggered with value:", searchValue);
            document.getElementById('input-field').value = "";
            navigate(`/products/${encodeURIComponent(JSON.stringify(location))}/${searchValue}`);
            window.location.reload();
        }
    };

    const handleSearchedText = (event) => {
        setSearchValue(event.target.value);
        // console.log("Search input updated to:", event.target.value);
    }

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-75">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="navbar border rounded-sm fixed max-w-screen-xl items-center z-20 opacity-60 bg-gray-900 text-yellow-300">
                    <div className="navbar-start bg-gray-900">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-800 rounded-box w-60">
                                <li><Link className="hover:bg-black hover:text-lg hover:text-yellow-300" to='/'>Home</Link></li>
                                <li><Link className="hover:bg-black hover:text-lg hover:text-yellow-300" to='/category'>Category</Link></li>
                                <li>
                                    <Link className="hover:text-lg text-sm hover:bg-amber-500" to='/dashboard/cart'>
                                        <button className="btn">
                                            Orders
                                            <div className="badge bg-amber-500 text-white text-sm">+{cart.length}</div>
                                        </button>
                                    </Link>
                                </li>
                                {user && (
                                    <div className="dropdown dropdown-end">
                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={user.photoURL} alt="" />
                                            </div>
                                        </div>
                                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black opacity-50 rounded-box w-52">
                                            <li>
                                                <div className="form-control">
                                                    <label className="label cursor-pointer">
                                                        <span className="text-teal-50"><Link to="/dashboard/myprofile">My Profile</Link></span>
                                                        <input type="radio" name="radio-10" className="ml-2 radio checked:bg-red-500" checked />
                                                    </label>
                                                </div>
                                                <div className="form-control">
                                                    <label className="label cursor-pointer">
                                                        <span className="text-teal-50"><Link to='/businessprofile/businessprofileform'>Business Profile</Link></span>
                                                        <Link to='/businessprofile/businessprofileform'><input type="radio" name="radio-10" className="ml-2 radio checked:bg-blue-500" /></Link>
                                                    </label>
                                                </div>
                                            </li>
                                            {/* <li><a className="hover:bg-black text-base hover:text-lg hover:text-yellow-500">Settings</a></li> */}
                                            <li className="p-2">
                                                <button onClick={handleLogOut} className="btn text-lg hover:bg-yellow-100 hover:pb-10 hover:text-sm hover:text-black btn-ghost">{user?.displayName} :-Log Out</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                {!user && (
                                    <ul>
                                        <li><Link className="hover:bg-black hover:text-lg hover:text-yellow-300" to='/createuser'>Sign Up</Link></li>
                                        <li><Link className="hover:bg-black hover:text-lg hover:text-yellow-300" to='/login'>Log in</Link></li>
                                    </ul>
                                )}
                            </ul>
                        </div>
                        <div className="d-flex border border-red-500 rounded-xl p-3">
                            <h1 className="btn btn-ghost md:text-4xl mb-0"><Link to={"/"}>NearYou</Link></h1>
                            <p className="text-center mt-0">Find here!</p>
                        </div>
                        <div className="ml-4 sm:w-auto">
                            {!hideSearch && user && (
                                <div className="input-group">
                                    <input
                                        id="input-field"
                                        onChange={handleSearchedText}
                                        onKeyDown={handleSearchResult}
                                        type="text"
                                        className="input input-bordered h-8 w-44 text-black text-sm"
                                        placeholder="Search"
                                    />
                                    <button onClick={handleSearchResult} className="btn btn-square mt-2 ml-14">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="currentColor" className="w-6 h-6 opacity-70 p-0">
                                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="navbar-end w-full hidden lg:flex">
                        <ul className="menu flex-row pr-0">
                            <li><Link className="hover:bg-black text-sm hover:text-lg hover:text-yellow-300" to='/'>Home</Link></li>
                            <li><Link className="hover:bg-black text-sm hover:text-lg hover:text-yellow-300" to='/category'>Category</Link></li>
                            <li>
                                <Link to='/dashboard/cart'>
                                    <button className="btn hover:text-sm hover:bg-black hover:text-white">
                                        Orders
                                        <div className="badge bg-amber-500 text-white text-sm">+{cart.length}</div>
                                    </button>
                                </Link>
                            </li>
                        </ul>
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={user.photoURL} alt="" />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black opacity-50 rounded-box w-52">
                                    <li>
                                        <div className="form-control">
                                            <label className="label cursor-pointer">
                                                <span className="text-teal-50"><Link to="/dashboard/myprofile">My Profile</Link></span>
                                                <input type="radio" name="radio-10" className="ml-2 radio checked:bg-red-500" checked />
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="label cursor-pointer">
                                                <span className="text-teal-50"><Link to='/businessprofile/businessprofileform'>Business Profile</Link></span>
                                                <Link to='/businessprofile/businessprofileform'><input type="radio" name="radio-10" className="ml-2 radio checked:bg-blue-500" /></Link>
                                            </label>
                                        </div>
                                    </li>
                                    {/* <li><a className="hover:bg-black text-base hover:text-lg hover:text-yellow-500">Settings</a></li> */}
                                    <li className="p-2">
                                        <button onClick={handleLogOut} className="btn text-lg hover:bg-yellow-100 hover:pb-10 hover:text-sm hover:text-black btn-ghost">{user?.displayName} :-Log Out</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <ul className="menu menu-horizontal px-1">
                                <li><Link className="hover:bg-black text-lg hover:text-lg hover:text-yellow-500" to='/createuser'>Sign Up</Link></li>
                                <li><Link className="hover:bg-black text-lg hover:text-lg hover:text-yellow-500" to='/login'>Log in</Link></li>
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};


export default Navbar;
