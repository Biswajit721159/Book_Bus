import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { FullPageLoader } from "./FullPageLoader";
import { useSelector } from "react-redux";

const ViewSeat = () => {

    const userinfo = useSelector((state) => state.userAuth.user);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const [disabled, setdisabled] = useState(false)
    const [button, setbutton] = useState("Find Bus")

    const [data, setdata] = useState([])
    const history = useNavigate()
    const [load, setload] = useState(true)
    const [date, setdate] = useState(today)

    const [src, setsrc] = useState("");
    const [erroInSrc, seterroInSrc] = useState(false)
    const [messerroInSrc, setmesserroInSrc] = useState("")

    const [errordate, seterrordate] = useState(false)
    const [messerrordate, setmesserrordate] = useState("")
    const [bus, setbus] = useState([])


    function FindError() {
        let x = true
        if (src === "Select Your Source Station" || src.length === 0) {
            seterroInSrc(true)
            setmesserroInSrc("*Select A Station")
            x = false
        }
        if (date.length === 0) {
            seterrordate(true)
            setmesserrordate("*Select A Date")
            x = false
        }
        return x;
    }

    function loadBus() {
        setload(true)
        fetch(`/businfo/${userinfo.user.email}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `bearer ${userinfo.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            setdata(res)
            setload(false)
        }, (error) => {
            history('*')
        })
    }

    useEffect(() => {
        if (!userinfo) {
            history('Login')
        }
        else {
            loadBus();
        }
    }, [])

    const minDate = () => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    };

    function findBusId() {
        for (let i = 0; i < data.length; i++) {
            if (data[i].bus_name === src) {
                return data[i]._id
            }
        }
        return null
    }

    function findbus() {
        if (FindError()) {
            seterroInSrc(false)
            seterrordate(false)
            setdisabled(true)
            let y = findBusId()
            setbutton("Wait Finding...")
            fetch('/businfo/getBookingStatus', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    auth: `bearer ${userinfo.auth}`
                },
                body: JSON.stringify({
                    "date": date,
                    "bus_id": y
                })
            }).then(response => response.json()).then((res) => {
                if (res != undefined) {
                    setdisabled(false)
                    setbutton("Find Bus")
                    setbus(res)
                    console.log(res)
                }
            }, (error) => {
                history('*')
            })
        }
    }

    return (
        <>
            {
                load == false ?
                    <>
                        <form onSubmit={(e) => { e.preventDefault(); findbus() }}>

                            <div className="d-flex align-items-center justify-content-center mt-5">
                                <div className="d-flex ">
                                    <select className="form-select" aria-label="Default select example" required onChange={(e) => { setsrc(e.target.value) }} style={{ backgroundColor: "white" }}>
                                        <option style={{ textAlign: "center" }} selected>Select your source station</option>
                                        {
                                            data.map((item, ind) => (
                                                <option key={ind} style={{ textAlign: "center" }} >{item.bus_name}</option>
                                            ))
                                        }
                                    </select>
                                    {erroInSrc ? <label className="mt-0" style={{ color: "red" }}>{messerroInSrc}</label> : ""}
                                </div>
                                <div className="d-flex ">
                                    <div className="input-group date" id="datepicker">
                                        <input type="date" className="form-control" value={date} min={minDate()} onChange={(e) => { setdate(e.target.value) }} required id="date" />
                                    </div>
                                    {errordate ? <label className="mt-0" style={{ color: "red" }}>{messerrordate}</label> : ""}
                                </div>
                                <div className="d-flex d-flex justify-content-center mx-1">
                                    <button type="submit" className="btn btn-primary btn-block " disabled={disabled}  >{button}</button>
                                </div>
                            </div>

                        </form>
                        <div className="container mt-5 my-5">
                            {
                                bus.length != 0 ?
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">PNR No</th>
                                                <th scope="col">Pay</th>
                                                <th scope="col">src</th>
                                                <th scope="col">dist</th>
                                                <th scope="col">Passenger Name</th>
                                                <th scope="col">seat_no</th>
                                                <th scope="col">total_distance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                bus.map((item, ind) => (
                                                    <tr>
                                                        <th scope="row">{item.PNR_No}</th>
                                                        <td>₹{item.Pay}</td>
                                                        <td>{item.src}</td>
                                                        <td>{item.dist}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.seat_no}</td>
                                                        <td>{item.total_distance} km</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    : <p className="d-flex align-items-center justify-content-center mt-5">Result Not Found</p>
                            }
                        </div>
                    </>
                    : <FullPageLoader open={load} />
            }
        </>
    )
}

export default ViewSeat