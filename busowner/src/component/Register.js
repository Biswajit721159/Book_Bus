import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { commonClass, ImageComponent } from "../helpers/CommonComponent";
import { TextField } from "@mui/material";
import { validateCompanyName, validateConfirmPassword, validatePhoneNumber, validateEmail, validateFullName, validatePassword } from "../helpers/fromValidationCheckers";
import { toast } from "react-toastify";
import { register } from "../utilities/authApi";
const Register = () => {

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useNavigate();
  const [load, setLoad] = useState(false);


  useEffect(() => {
    const auth = localStorage.getItem('user')
    if (auth) {
      history(-1);
    }
  }, [])

  async function submit() {
    if (!validateFullName(fullName)) {
      toast.warn("Full name must have two parts, each part between 2 and 50 alphabetic characters.")
    }
    else if (!validateCompanyName(companyName)) {
      toast.warn("Company name must be between 2 and 100 characters, allowing letters, numbers, &, -, and .")
    }
    else if (!validateEmail(email)) {
      toast.warn("Email must be a valid format and between 5 and 100 characters.")
    }
    else if (!validatePhoneNumber(phoneNumber)) {
      toast.warn("Phone number must be between 10 and 15 digits, allowing optional country code.")
    }
    else if (!validatePassword(password)) {
      toast.warn("Password must be between 8 and 20 characters, and must contain at least: One uppercase letter, One lowercase letter,  One digit, One special character (@$!%*?&#)")
    }
    else if (!validateConfirmPassword(password, confirmPassword)) {
      toast.warn("Password and confirm password must be same.");
    } else {
      try {
        setLoad(true);
        let response = await register({ fullName, companyName, email, phoneNumber, password });
        if (response?.statusCode === 201) {
          toast.success(response?.message);
          history('/Login');
        }
        else {
          toast.warn(response?.message);
        }
        setLoad(false);
      } catch (e) {
        toast.warn(e?.message);
        setLoad(false);
      }
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <div onSubmit={submit} className="rounded-md shadow p-10 m-50 flex justify-center flex-col items-center">
          <ImageComponent />
          <div className="mt-2 flex justify-between gap-2">
            <TextField
              type="text"
              size="small"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value) }}
              className={commonClass}
              placeholder="Enter Full Name"
              required />
            <TextField
              type="text"
              size="small"
              value={companyName}
              onChange={(e) => { setCompanyName(e.target.value) }}
              className={commonClass}
              placeholder="Company Name"
              required />
          </div>
          <div className="mt-2 flex justify-between gap-2">
            <TextField
              type="email"
              size="small"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              className={commonClass}
              placeholder="Enter Email Id"
              required />
            <TextField
              type="number"
              size="small"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value) }}
              className={commonClass}
              placeholder="Enter Phone Number"
              required />
          </div>
          <div className="mt-2 flex justify-between gap-2">
            <TextField
              type="password"
              size="small"
              value={password}
              onChange={(e) => { setpassword(e.target.value) }}
              className={commonClass}
              placeholder="Enter Password"
              required />
            <TextField
              type="password"
              size="small"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value) }}
              className={commonClass}
              placeholder="Enter Confirm Password"
              required />
          </div>
          <button
            className="px-3 py-1 mt-3 border-none text-white text-sm bg-green-500 rounded-md shadow hover:bg-green-600"
            disabled={load}
            onClick={submit}
          >
            {
              !load ?
                <>
                  Sign Up <i className="fas fa-arrow-right fa-xs ml-1"></i>
                </>
                :
                <>
                  Loging... <i className="fas fa-circle-notch fa-spin fa-xs"></i>
                </>
            }
          </button>
          <div className="flex justify-between mt-4 gap-5">
            <Link to={'/Login'} className="text-blue-500">Already have an account? Log in</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;