import React from "react";
import { useNavigate } from "react-router-dom";
import { ImageComponent } from "../helpers/CommonComponent";
import { useSelector } from "react-redux";

const WelcomePage = () => {
    const navigate = useNavigate();
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const userinfo = useSelector((state) => state.userAuth.user);

    return (
        <div className="bg-gradient-to-b from-white-50 to-white-100  flex flex-col justify-center items-center">
            <div className="mt-12 animate-fadeIn">
                <ImageComponent />
            </div>
            <header className="text-center mb-6 mt-10 animate-slideUp">
                <h1 className="text-5xl font-bold text-gray-800 drop-shadow-md">
                    Welcome to {otherUserinfo?.role === '200' ? 'SuperAdmin Panel' : 'Admin Panel'}
                </h1>
                <p className="text-lg text-gray-700 mt-3 font-light">
                    Manage bus schedules effortlessly with our user-friendly interface.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mt-8 animate-slideUp delay-1">
                {!userinfo ? (
                    <div className="flex space-x-4">

                        <button
                            onClick={() => navigate("/Login")}
                            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 shadow-lg transform transition-transform hover:scale-105"
                        >
                            Log In
                        </button>

                        <button
                            onClick={() => navigate("/Register")}
                            className="bg-gray-200 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 shadow-lg transform transition-transform hover:scale-105"
                        >
                            Register
                        </button>
                    </div>
                ) : (
                    otherUserinfo?.role === '200' ?
                        <button
                            className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transform transition-transform hover:scale-105"
                            onClick={() => navigate('/SuperAdminpanel')}
                        >
                            Go To SuperAdminpanel
                        </button>
                        :
                        <button
                            className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transform transition-transform hover:scale-105"
                            onClick={() => navigate('/Adminpanel')}
                        >
                            Go To Adminpanel
                        </button>
                )
                }
            </div>


            <footer className="absolute bottom-5 text-center text-gray-500 text-sm animate-fadeIn">
                &copy; {new Date().getFullYear()} Bus Schedule Manager. All rights reserved.
            </footer>
        </div>
    );
};

export default WelcomePage;
