// import React from 'react';
import { useContext, useState } from "react";
import img from "../../assets/All Banners/login.jpg";
import { AuthContext } from "../../Context Providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';

// const Login = () => {

//     const { loggIn } = useContext(AuthContext);
//     const [lastLocation] = useState('/');

//     const navigate=useNavigate();
//     const location=useLocation();

//     let from=location?.state?.from?.pathname || '/';

//     const handleLogIn = (event) => {
//         event.preventDefault();
//         const form = event.target;
//         const mail = form.email.value;
//         const pass = form.password.value;
//         console.log(mail, pass);
//         loggIn(mail, pass)
//             .then(result => {
//                 const user = result.user;
//                 console.log(user);
//                 alert("Account Logged In");
//                 // localStorage.setItem('lastLocation', lastLocation);
//                 // window.location.href = lastLocation;
//             });
//             navigate(from,{replace:true});
//     }
//     return (
//         <div>
//             <Helmet>
//                 <title>Log In</title>
//             </Helmet>
//             <div className="hero min-h-screen bg-base-200">
//                 <div className="hero-content flex">
//                     <div className="">
//                         <img className="sm:h-80 md:h-full" src={img} alt="" />
//                     </div>
//                     <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
//                         <h1 className="text-3xl text-center m-4 font-bold">Log In now!</h1>
//                         <form onSubmit={handleLogIn} className="card-body">
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text">Email</span>
//                                 </label>
//                                 <input type="email" name="email" placeholder="email" className="input input-bordered" required />
//                             </div>
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text">Password</span>
//                                 </label>
//                                 <input type="password" name="password" placeholder="password" className="input input-bordered" required />
//                             </div>
//                             <div className="form-control mt-6">
//                                 <input className="btn btn-primary" type="submit" value="Log in" />
//                             </div>
//                         </form>
//                         <p className="m-2 text-center"><small>New here? <Link className="text-blue-400" to="/createuser"> Create an account</Link></small></p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
const Login = () => {
    const { loggIn } = useContext(AuthContext);
    const [lastLocation] = useState('/');
    const [alertVisible, setAlertVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    let from = location?.state?.from?.pathname || '/';

    const handleLogIn = (event) => {
        event.preventDefault();
        const form = event.target;
        const mail = form.email.value;
        const pass = form.password.value;
        console.log(mail, pass);
        loggIn(mail, pass)
            .then(result => {
                const user = result.user;
                console.log(user);
                setAlertVisible(true);
                setTimeout(() => {
                    setAlertVisible(false);
                }, 2000);
                navigate(from, { replace: true });
            });
    }

    return (
        <div>
            <Helmet>
                <title>Log In</title>
            </Helmet>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex">
                    <div className="">
                        <img className="sm:h-80 md:h-full" src={img} alt="" />
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <h1 className="text-3xl text-center m-4 font-bold">Log In now!</h1>
                        {alertVisible && (
                            <div className="alert alert-success shadow-lg">
                                <div>
                                    <span>Account Logged In</span>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleLogIn} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                <input className="btn btn-primary" type="submit" value="Log in" />
                            </div>
                        </form>
                        <p className="m-2 text-center"><small>New here? <Link className="text-blue-400" to="/createuser"> Create an account</Link></small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;