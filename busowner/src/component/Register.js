import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    validateCompanyName, validateConfirmPassword, validatePhoneNumber,
    validateEmail, validateFullName, validatePassword
} from "../helpers/fromValidationCheckers";
import { toast } from "react-toastify";
import { register } from "../utilities/authApi";
import { logo } from "../utilities/logo";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user')) navigate(-1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function submit(e) {
        e?.preventDefault();
        if (!validateFullName(fullName)) {
            toast.warn("Full name must have two parts, each 2–50 alphabetic characters.");
            return;
        }
        if (!validateCompanyName(companyName)) {
            toast.warn("Company name must be 2–100 characters (letters, numbers, &, -, .)");
            return;
        }
        if (!validateEmail(email)) {
            toast.warn("Please enter a valid email address.");
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            toast.warn("Phone number must be 10–15 digits.");
            return;
        }
        if (!validatePassword(password)) {
            toast.warn("Password must be 8–20 characters with uppercase, lowercase, digit, and special character.");
            return;
        }
        if (!validateConfirmPassword(password, confirmPassword)) {
            toast.warn("Passwords do not match.");
            return;
        }
        try {
            setLoad(true);
            const response = await register({ fullName, companyName, email, phoneNumber, password });
            if (response?.statusCode === 201) {
                toast.success(response?.message);
                navigate('/Login');
            } else {
                toast.warn(response?.message);
            }
        } catch (e) {
            toast.warn(e?.message);
        } finally {
            setLoad(false);
        }
    }

    const PasswordToggle = ({ show, onToggle }) => (
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
            {show ? (
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
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg animate-fade-in">
                <div className="card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img src={logo} alt="logo" className="h-14 w-14 rounded-xl object-cover shadow-card" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                        <p className="text-sm text-slate-500 mt-1">Register as a bus owner or admin</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label" htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    className="input-field"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="input-label" htmlFor="companyName">Company Name</label>
                                <input
                                    id="companyName"
                                    type="text"
                                    className="input-field"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Acme Transport Co."
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="input-label" htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    className="input-field"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+91 9876543210"
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="input-field pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                    <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        className="input-field pr-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat password"
                                        required
                                    />
                                    <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">
                            Password must be 8–20 characters and include uppercase, lowercase, a digit, and a special character (@$!%*?&#).
                        </p>

                        <button
                            type="submit"
                            className="btn-primary w-full py-3 text-base mt-2"
                            disabled={load}
                        >
                            {load ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/Login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
