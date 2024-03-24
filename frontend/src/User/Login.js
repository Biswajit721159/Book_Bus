import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { usermethod } from '../redux/UserSlice'
const api=process.env.REACT_APP_API
// const api = "http://localhost:5000"
export default function Login() {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const history = useNavigate();
    const [wronguser, setwronguser] = useState(false)
    const [button, setbutton] = useState("Submit")
    const [disabled, setdisabled] = useState(false)

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        if (user?.user?.auth) {
            history('/BookBus')
        }
    }, [])

    function submit() {
        setbutton("Please Wait ...")
        setdisabled(true)
        fetch(`${api}/login`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email, password: password
            })
        })
            .then(response => response.json())
            .then((result) => {
                if (result.auth) {
                    dispatch(usermethod.Add_User(result))
                    history('/BookBus')
                }
                else {
                    setbutton("Submit")
                    setdisabled(false)
                    setwronguser(true)
                }
            }, (error) => {
                setbutton("Submit")
                setdisabled(false)
                setwronguser(true)
            })
    }

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div>
                <div className=" mt-2"><h3>Login</h3></div>
                <div className="mt-2">
                    <div className="form-group">
                        <input type="email" value={email} onChange={(e) => { setemail(e.target.value) }} className="form-control" placeholder="Enter Email Id" required />
                    </div>
                </div>
                <div className="mt-2">
                    <div className="form-group">
                        <input type="password" value={password} onChange={(e) => { setpassword(e.target.value) }} className="form-control" placeholder="Enter Password" required />
                        {wronguser ? <label style={{ color: "red" }}>*Invalid User</label> : ""}
                    </div>
                </div>
                <div className="mt-3">
                    <button className="btn btn-primary btn-sm" disabled={disabled} onClick={submit}>{button}</button>
                </div>
            </div>
        </div>
    )
}