import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Navbar = () => {
    const userinfo = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('user');
        navigate('/Login');
    }

    return (
        <nav className="bg-blue-500 shadow text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <p className="text-xl font-semibold flex items-center">
                            <AdminPanelSettingsIcon className="mr-2" />
                            Adminpanel
                        </p>
                    </div>
                    <div className="flex space-x-8">
                        <ul className="flex space-x-6">
                            <li>
                                <Link className="text-white-500 hover:text-white-600" to="/">Home</Link>
                            </li>
                            {
                                userinfo == null ?
                                    <>
                                        <li>
                                            <Link className="text-white-600 hover:text-white-500" to="/Login">Login</Link>
                                        </li>
                                        <li>
                                            <Link className="text-white-500 hover:text-white-600" to="/Register">Register</Link>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li>
                                            <Link className="text-white-500 hover:text-white-600" to="/Bus_adder">Add Bus</Link>
                                        </li>
                                        <li>
                                            <Link className="text-white-500 hover:text-white-600" to="/ViewSeat">View Seat</Link>
                                        </li>
                                    </>
                            }
                        </ul>
                        {
                            userinfo &&
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm focus:outline-none"
                                onClick={logout}
                            >
                                Logout <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
