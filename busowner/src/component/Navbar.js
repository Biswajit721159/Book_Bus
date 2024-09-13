import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useDispatch, useSelector } from "react-redux";
import { usermethod } from '../redux/userSlice'
import { toast } from 'react-toastify'

const Navbar = () => {
    const userinfo = useSelector((state) => state.userAuth.user);
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function Logout() {
        dispatch(usermethod.Logout_User());
        navigate('/Login');
        toast("Successfully logout");
    }

    function goToMainPage() {
        if (otherUserinfo.role === '100') {
            navigate('Adminpanel')
        } else if (otherUserinfo.role === '200') {
            navigate('SuperAdminpanel');
        }
    }

    return (
        <nav className="bg-blue-500 shadow text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <p className="text-xl font-semibold flex items-center cursor-pointer" onClick={() => goToMainPage()}>
                            {otherUserinfo.role !== '' ? <AdminPanelSettingsIcon className="mr-1" /> : ''}
                            {
                                otherUserinfo.role === "100" ?
                                    'Adminpanel'
                                    : otherUserinfo.role === "200" ? 'SuperAdminpanel' : ''
                            }
                        </p>
                    </div>
                    <div className="flex space-x-8">
                        <ul className="flex space-x-6">
                            <li>
                                {
                                    otherUserinfo.role !== '' ?
                                        <Link className="text-white-500 hover:text-white-600" to="/">Home</Link>
                                        : ''
                                }
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
                                        {otherUserinfo.role === '100' ?
                                            <>
                                                <li>
                                                    <Link className="text-white-500 hover:text-white-600" to="/BusAdder">
                                                        Add Bus
                                                    </Link>
                                                </li>
                                                <li>

                                                    <Link className="text-white-500 hover:text-white-600" to="/ViewSeat">
                                                        View Seat
                                                    </Link>
                                                </li>
                                            </>
                                            :
                                            ''
                                        }

                                    </>
                            }
                        </ul>
                        {
                            userinfo &&
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm focus:outline-none"
                                onClick={Logout}
                            >
                                Logout  <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
