import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Checkbox, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { commonClass, ImageComponent } from "../helpers/CommonComponent";
import { validateEmail, validatePassword } from '../helpers/fromValidationCheckers'
import { login } from "../utilities/authApi";

export default function Login() {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false);
    const history = useNavigate();
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('user')
        if (auth) {
            history('/')
        }
    }, [])

    async function submit() {
        if (!validateEmail(email)) {
            toast.warn("Email must be a valid format and between 5 and 100 characters.")
        } else if (!validatePassword(password)) {
            toast.warn("Password must be between 8 and 20 characters, and must contain at least: One uppercase letter, One lowercase letter,  One digit, One special character (@$!%*?&#)")
        } else {
            try {
                setLoad(true);
                let response = await login({ email, password, rememberMe });
                if (response.statusCode === 200) {
                    toast.success(response?.message);
                    localStorage.setItem('user', JSON.stringify(response?.data));
                    history('/');
                } else {
                    toast.warn(response?.message);
                }
                setLoad(false);
            } catch (e) {
                toast.warn(e?.message);
                setLoad(false)
            }
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center mt-5">
            <div className="rounded-md shadow p-10 m-50 flex justify-center flex-col items-center">
                <ImageComponent />

                <div className="mt-2">
                    <TextField
                        type="email"
                        size="small"
                        className={commonClass}
                        value={email}
                        onChange={(e) => { setemail(e.target.value) }}
                        placeholder="Enter Email Id"
                        required
                    />
                </div>
                <div className="mt-2">
                    <TextField
                        size="small"
                        className={commonClass}
                        type="password"
                        value={password}
                        onChange={(e) => { setpassword(e.target.value) }}
                        placeholder="Enter Password"
                        required
                    />
                </div>
                <div className="mt-1 mr-5">
                    <Checkbox
                        checked={rememberMe}
                        onChange={(e) => {
                            setRememberMe(e.target.checked)
                        }}
                    />
                    <label>Remember me</label>
                </div>
                <button
                    className="px-3 py-1 mt-3 border-none text-white text-sm bg-green-500 rounded-md shadow hover:bg-green-600"
                    disabled={load}
                    onClick={submit}
                >
                    {!load ? <>Log In <i className="fas fa-arrow-right fa-xs ml-1"></i></>
                        : <>
                            Loging... <i className="fas fa-circle-notch fa-spin fa-xs"></i>
                        </>}
                </button>
                <div className="flex justify-between mt-4 gap-5">
                    <Link to={'/Register'} className="text-blue-500">Create an account</Link>
                    <Link to={'/ForgotPassword'} className="text-blue-500">Forgot Password?</Link>
                </div>
            </div>
        </div>
    )
}