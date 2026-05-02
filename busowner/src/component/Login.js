import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { validateEmail, validatePassword } from '../helpers/fromValidationCheckers';
import { login } from "../utilities/authApi";
import { useDispatch, useSelector } from "react-redux";
import { usermethod } from '../redux/userSlice';
import { logo } from "../utilities/logo";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userinfo = useSelector((state) => state.userAuth.user);

    useEffect(() => {
        if (userinfo) navigate('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function submit(e) {
        e?.preventDefault();
        if (!validateEmail(email)) {
            toast.warn("Please enter a valid email address.");
            return;
        }
        if (!validatePassword(password)) {
            toast.warn("Password must be 8–20 characters with uppercase, lowercase, digit, and special character.");
            return;
        }
        try {
            setLoad(true);
            const response = await login({ email, password, rememberMe });
            if (response.statusCode === 200) {
                toast.success(response?.message);
                dispatch(usermethod.Add_User(response?.data));
                navigate(-1);
            } else {
                toast.warn(response?.message);
            }
        } catch (e) {
            toast.warn(e?.message);
        } finally {
            setLoad(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-in">
                {/* Card */}
                <div className="card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img src={logo} alt="logo" className="h-14 w-14 rounded-xl object-cover shadow-card" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                        <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="input-label" htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <label className="input-label" htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-600">Remember me</span>
                            </label>
                            <Link to="/ForgotPassword" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-3 text-base mt-2"
                            disabled={load}
                        >
                            {load ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/Register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
