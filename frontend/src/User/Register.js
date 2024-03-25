import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { usermethod } from '../redux/UserSlice'
const api = process.env.REACT_APP_API
const Register = () => {

  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const history = useNavigate();

  const [wrongname, setwrongname] = useState(false)
  const [wrongemail, setwrongemail] = useState(false)
  const [wrongpassword, setwrongpasword] = useState(false)


  const [messname, setmessname] = useState("")
  const [messemail, setmessemail] = useState("")
  const [messpassword, setmesspassword] = useState("");

  const [button, setbutton] = useState("Submit")
  const [disabled, setdisabled] = useState(false)
  const userinfo = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userinfo?.user?.auth) {
      history('/BookBus')
    }
  }, [])

  function checkforname(s) {
    var regex = /^[a-zA-Z ]{2,30}$/;
    let a = regex.test(s);
    if (a == false) {
      setwrongname(true)
      setmessname("*Name must be only string and should not contain symbols or numbers")
    }
    return a;
  }

  function checkforemailid(s) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let a = regex.test(s);
    if (a == false) {
      setwrongemail(true)
      setmessemail("*Email Address must be in valid formate with @ symbol")
    }
    return a;
  }

  function checkpassword(s) {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    let a = regex.test(s);
    if (a == false) {
      setwrongpasword(true)
      setmesspassword("*Password must have at least one Uppercase, lowercase, digit, special characters & 8 characters")
    }
    return a;
  }

  function submit() {
    let a = checkforname(name)
    let b = checkforemailid(email)
    let c = checkpassword(password)
    setwrongname(!a)
    setwrongemail(!b)
    setwrongpasword(!c)

    if (a && b && c) {
      setbutton("Please Wait....")
      setdisabled(true)
      fetch(`${api}/user/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        })
      })
        .then(response => response.json())
        .then((result) => {
          if (result.statusCode === 201) {
            dispatch(usermethod.Add_User(result.data))
            history('/BookBus')
          }
          else if (result.statusCode === 498) {
            history('/Login')
          }
          else {
            setbutton("Submit")
            setdisabled(false)
            setwrongemail(true)
            setmessemail(result.message)
          }
        })
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div>
        <div className="mt-3">
          <h3>Register</h3>
        </div>
        <div className="mt-2">
          <div className="form-group">
            <input type="text" value={name} onChange={(e) => { setname(e.target.value) }} className="form-control" placeholder="Enter Full Name" required />
            {wrongname ? <label style={{ color: "red" }}>{messname}</label> : ""}
          </div>
        </div>
        <div className="mt-2">
          <div className="form-group">
            <input type="email" value={email} onChange={(e) => { setemail(e.target.value) }} className="form-control" placeholder="Enter Email Id" required />
            {wrongemail ? <label style={{ color: "red" }}>{messemail}</label> : ""}
          </div>
        </div>
        <div className="mt-2">
          <div className="form-group">
            <input type="password" value={password} onChange={(e) => { setpassword(e.target.value) }} className="form-control" placeholder="Enter Password" required />
            {wrongpassword ? <label style={{ color: "red" }}>{messpassword}</label> : ""}
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary btn-sm" disabled={disabled} onClick={submit}>{button}</button>
        </div>
      </div>
    </div>
  )
}

export default Register;