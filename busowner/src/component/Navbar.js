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
                                <button className="text-sm bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 shadow-lg transform transition-transform hover:scale-105" onClick={() => navigate('/')}>Home</button>
                            </li>
                            {
                                userinfo == null ?
                                    <>
                                        <li>
                                            <button className="text-sm p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-white-600 hover:text-white-500 transform transition-transform hover:scale-105" onClick={() => navigate('/Login')}>Login</button>
                                        </li>
                                        <li>
                                            <button className="text-sm p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-white-500 hover:text-white-600 transform transition-transform hover:scale-105" onClick={() => navigate('/Register')} >Register</button>
                                        </li>
                                    </>
                                    :
                                    <>
                                        {otherUserinfo.role === '100' ?
                                            <>
                                                <li>
                                                    <button className="text-sm p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-white-500 hover:text-white-600 transform transition-transform hover:scale-105" onClick={() => navigate('/BusAdder')} to="/BusAdder">
                                                        Add Bus
                                                    </button>
                                                </li>
                                                <li>

                                                    <button className="text-sm p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-white-500 hover:text-white-600 transform transition-transform hover:scale-105" onClick={() => navigate('/ViewSeat')} to="/ViewSeat">
                                                        View Seat
                                                    </button>
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
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm focus:outline transform transition-transform hover:scale-105"
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
