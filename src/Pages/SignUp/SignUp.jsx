import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/All Banners/20824341_6368592.jpg";
import { Helmet } from "react-helmet-async";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context Providers/AuthProvider";
import useAxiosfor from "../../hooks/useAxiosfor";

const SignUp = () => {
    const navigate = useNavigate();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const axiosFor = useAxiosfor();
    const [lastLocation] = useState('/');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const photourl = form.photourl.value;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const result = await createUser(email, password);
            const loggedUser = result.user;
            // console.log(loggedUser);

            await updateUserProfile(name, photourl);
            console.log('User Profile info has been updated');

            const payload = {
                userId: loggedUser.uid,
                name,
                photourl,
                email,
                haveBusiness: false
            };

            const response = await axiosFor.post('/users', payload);
            if (response.status === 201 || response.status === 200) {
                console.log('User profile created in backend:', response.data);
                alert("Account Created");
                localStorage.setItem('lastLocation', lastLocation);
                navigate(lastLocation);
            } else {
                console.error('Error creating user profile in backend:', response.statusText);
                setErrorMessage('Error creating user profile in backend');
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            if (error.response && error.response.status === 409) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex">
                    <div className="">
                        <img className="sm:h-80 md:h-full" src={img} alt="" />
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <h1 className="text-3xl text-center m-4 font-bold">Sign Up now!</h1>
                        <form onSubmit={handleSignUp} className="card-body">
                            {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" name="name" placeholder="name" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo Url</span>
                                </label>
                                <input type="text" name="photourl" placeholder="photo URL" className="input input-bordered" required />
                            </div>
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
                                <input className="btn btn-primary" type="submit" value="Sign Up" />
                            </div>
                        </form>
                        <p className="m-2 text-center"><small>Have an account? <Link className="text-blue-400" to="/login">Log in</Link></small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
