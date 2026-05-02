import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usermethod } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { logo } from "../utilities/logo";

const NAV_ITEMS_ADMIN = [
    {
        label: 'Dashboard',
        path: '/Adminpanel',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: 'Add Bus',
        path: '/BusAdder',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
    {
        label: 'View Seats',
        path: '/ViewSeat',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
    },
];

const NAV_ITEMS_SUPERADMIN = [
    {
        label: 'Dashboard',
        path: '/SuperAdminpanel',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: 'Manage Users',
        path: '/ManageUser',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Bookings',
        path: '/Booking',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
];

const Navbar = () => {
    const userinfo = useSelector((state) => state.userAuth.user);
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navItems = otherUserinfo.role === '100' ? NAV_ITEMS_ADMIN : NAV_ITEMS_SUPERADMIN;
    const panelLabel = otherUserinfo.role === '100' ? 'Admin Panel' : otherUserinfo.role === '200' ? 'Super Admin' : 'Bus Manager';

    async function handleLogout() {
        dispatch(usermethod.Logout_User());
        navigate('/Login');
        toast.success("Logged out successfully");
        setDrawerOpen(false);
    }

    if (!userinfo) return null;

    return (
        <>
            {/* Top Navbar */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Left: Logo + Brand */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="btn-icon text-slate-500 lg:hidden"
                                aria-label="Open menu"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div
                                className="flex items-center gap-2.5 cursor-pointer"
                                onClick={() => navigate('/')}
                            >
                                <img src={logo} alt="logo" className="h-8 w-8 rounded-md object-cover" />
                                <span className="font-semibold text-slate-800 text-sm hidden sm:block">
                                    {panelLabel}
                                </span>
                            </div>
                        </div>

                        {/* Center: Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg
                                               hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150"
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Right: User info + Logout */}
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary-700">
                                        {userinfo?.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                                    {userinfo?.user?.fullName}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg
                                           hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                                title="Logout"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setDrawerOpen(false)}
                >
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
                    <aside
                        className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <img src={logo} alt="logo" className="h-8 w-8 rounded-md object-cover" />
                                <span className="font-semibold text-slate-800">{panelLabel}</span>
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="btn-icon text-slate-400"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary-700">
                                        {userinfo?.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{userinfo?.user?.fullName}</p>
                                    <p className="text-xs text-slate-500">{userinfo?.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Nav Items */}
                        <nav className="px-3 py-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg
                                               hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 mb-0.5"
                                >
                                    <span className="text-slate-400">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Logout */}
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg
                                           hover:bg-red-50 transition-colors duration-150"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
};

export default Navbar;
