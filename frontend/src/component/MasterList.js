import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import Loader from "./Loader";
const api = process.env.REACT_APP_API
const MasterList = () => {
    const [name, setname] = useState("")
    const [wrongname, setwrongname] = useState(false)
    const [messname, setmessname] = useState("")

    const [updatename, setupdatename] = useState("")
    const [wrongupdatename, setwrongupdatename] = useState(false)
    const [messupdatename, setmessupdatename] = useState("")

    const [add, setadd] = useState(true)
    const [data, setdata] = useState([])
    const userinfo = useSelector((state) => state.user)
    const history = useNavigate();
    const [Submit, setSubmit] = useState("Submit")
    const [disable, setdisable] = useState(false)
    const [load, setload] = useState(true)
    const [DeleteButton, setDeleteButton] = useState("Delete")
    const [Deletedisable, setDeletedisable] = useState(false)

    const [takeid, settakeid] = useState('')

    const [updateinput, setupdateinput] = useState(false)
    const [update_id, setupdate_id] = useState('')

    const [disableupdate, setdisableupdate] = useState(false)
    const [updatebutton, setupdatebutton] = useState("Update")


    useEffect(() => {
        if (!userinfo?.user) {
            history('/Login')
        }
        else {
            loaddata()
        }
    }, [])

    function loaddata() {
        setload(true)
        fetch(`${api}/MasterList/${userinfo?.user?.user._id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            if (res.statusCode === 200) {
                setload(false)
                setdata(res.data)
            }
            else {
                history('*')
            }
        }, (error) => {
            history('*')
        })
    }

    function addhtml() {
        setadd(false)
    }

    function finderrorName(s) {
        var regex = /^[a-zA-Z ]{2,30}$/;
        let a = regex.test(s);
        return a;
    }

    function submit() {
        let res = finderrorName(name)
        if (res == true) {
            setwrongname(false)
            setmessname("")
            setdisable(true)
            setSubmit("Please Wait....")
            fetch(`${api}/MasterList/${userinfo?.user?.user?._id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userinfo?.user?.auth}`
                },
                body: JSON.stringify({
                    user_id: userinfo?.user?.user?._id,
                    name: name
                })
            }).then(response => response.json()).then((res) => {
                if (res.statusCode === 201) {
                    setadd(true)
                    setdisable(false)
                    setSubmit("Submit")
                    setname("")
                    loaddata()
                } else {
                    history('*')
                }
            }, (error) => {
                history('*')
            })
        }
        else {
            setwrongname(true)
            setmessname("*Name must be only string and should not contain symbols or numbers and string length is less then 2")
        }
    }

    function Delete_user(id) {
        settakeid(id)
        setDeleteButton("Please Wait...")
        setDeletedisable(true)
        fetch(`${api}/MasterList/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            },
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined) {
                setDeletedisable(false)
                setDeleteButton("Delete")
                settakeid('')
                loaddata()
            }
        }, (error) => {
            history('*')
        })
    }

    function Update(id, name) {
        setupdate_id(id)
        setupdateinput(true)
        setupdatename(name)
    }

    function ActualUpdate(id) {
        let res = finderrorName(updatename)
        if (res == true) {
            setwrongupdatename(false)
            setmessupdatename("")


            setupdatebutton("Please Wait...")
            setdisableupdate(true)
            fetch(`${api}/MasterList/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userinfo?.user?.auth}`
                },
                body: JSON.stringify({
                    name: updatename
                })
            }).then(responce => responce.json()).then((res) => {
                if (res.statusCode === 200) {
                    loaddata()
                    setupdatebutton("Update")
                    setdisableupdate(false)
                    setupdate_id('')
                } else {
                    history('*')
                }
            }, (error) => {
                history('*')
            })
        }
        else {
            setwrongupdatename(true)
            setmessupdatename("*Name must be only string and should not contain symbols or numbers and string length is less then 2")
        }
    }

    return (
        <>
            {
                load == false ?
                    <div className="container">
                        <div className="row">
                            {
                                add == true ?
                                    <div className="col"><button className="btn btn-primary mt-2 btn-sm" onClick={addhtml}>Add+</button></div>
                                    :
                                    <>
                                        <div className="col">
                                            <div className="form-group mt-2">
                                                <input type="text" value={name} onChange={(e) => { setname(e.target.value) }} className="form-control" placeholder="Enter Full Name" required />
                                                {wrongname ? <label style={{ color: "red" }}>{messname}</label> : ""}
                                            </div>
                                        </div>
                                        <div className="col"><button className="btn btn-success mt-2  btn-sm" disabled={disable} onClick={submit}>{Submit}</button></div>
                                    </>
                            }
                        </div>
                        <table class="table mt-3">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">#Action1</th>
                                    <th scope="col">#Action2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && data.length !== 0 && data.map((item, ind) => (
                                        <tr key={ind}>
                                            <th >{ind + 1}</th>
                                            {
                                                updateinput == true && update_id == item._id ?
                                                    <div className="form-group">
                                                        <input type="text" style={{ backgroundColor: "#BFC9CA" }} value={updatename} onChange={(e) => { setupdatename(e.target.value) }} className="form-control" placeholder="Enter Full Name" required />
                                                        {wrongupdatename ? <label style={{ color: "red" }}>{messupdatename}</label> : ""}
                                                    </div>
                                                    : <td>{item.name}</td>
                                            }
                                            {
                                                updateinput == true && update_id == item._id ?
                                                    <td><button className="btn btn-primary  btn-sm" disabled={disableupdate} onClick={() => ActualUpdate(item._id)}>{updatebutton}</button></td>
                                                    : <td><button className="btn btn-primary  btn-sm" onClick={() => Update(item._id, item.name)}>Update</button></td>
                                            }
                                            {
                                                item._id == takeid ? <td><button className="btn btn-danger  btn-sm" disabled={Deletedisable} onClick={() => Delete_user(item._id)}>{DeleteButton}</button></td>
                                                    : <td><button className="btn btn-danger  btn-sm" onClick={() => Delete_user(item._id)}>Delete</button></td>
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    : <Loader />
            }
        </>
    )
}
export default MasterList