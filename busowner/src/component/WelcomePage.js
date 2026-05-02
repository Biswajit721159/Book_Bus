import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logo } from "../utilities/logo";

const WelcomePage = () => {
    const navigate = useNavigate();
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const userinfo = useSelector((state) => state.userAuth.user);

    const isSuperAdmin = otherUserinfo?.role === '200';
    const isAdmin = otherUserinfo?.role === '100';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="text-center max-w-2xl mx-auto animate-fade-in">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-card-hover flex items-center justify-center p-2">
                            <img src={logo} alt="Bus Manager" className="w-full h-full object-contain rounded-xl" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        {userinfo
                            ? `Welcome back, ${userinfo?.user?.fullName?.split(' ')[0]}`
                            : 'Bus Schedule Manager'
                        }
                    </h1>
                    <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                        {isSuperAdmin
                            ? 'Manage bus approvals, bookings, and users from your super admin dashboard.'
                            : isAdmin
                                ? 'Add and manage your buses, view seat availability, and track schedules.'
                                : 'A professional platform for managing bus schedules and bookings efficiently.'
                        }
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {!userinfo ? (
                            <>
                                <button
                                    onClick={() => navigate("/Login")}
                                    className="btn-primary px-8 py-3 text-base w-full sm:w-auto"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate("/Register")}
                                    className="btn-secondary px-8 py-3 text-base w-full sm:w-auto"
                                >
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate(isSuperAdmin ? '/SuperAdminpanel' : '/Adminpanel')}
                                className="btn-primary px-8 py-3 text-base"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Go to {isSuperAdmin ? 'Super Admin' : 'Admin'} Dashboard
                            </button>
                        )}
                    </div>
                </div>

                {/* Feature Cards */}
                {!userinfo && (
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl w-full mx-auto px-4 animate-slide-up">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: 'Schedule Management',
                                desc: 'Easily add and manage bus routes and timetables.',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                ),
                                title: 'Booking Tracking',
                                desc: 'Monitor all bookings and passenger details in real time.',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                title: 'User Management',
                                desc: 'Manage bus owners and passengers from one place.',
                            },
                        ].map((feature, i) => (
                            <div key={i} className="card p-5 text-center hover:shadow-card-hover transition-shadow duration-200">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-5 text-center text-sm text-slate-400 border-t border-slate-200 bg-white/50">
                &copy; {new Date().getFullYear()} Bus Schedule Manager. All rights reserved.
            </footer>
        </div>
    );
};

export default WelcomePage;
