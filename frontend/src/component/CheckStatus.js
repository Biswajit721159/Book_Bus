import React, { useState } from 'react'
import { Link, json, useNavigate, useParams, useLocation } from 'react-router-dom';

const CheckStatus = () => {

    const [idNumber, setidNumber] = useState(0)
    const [wrongidNumber, setwrongidNumber] = useState(false)
    const [messidNumber, setmessidNumber] = useState("")
    const [button, setbutton] = useState("Check")
    const [disabled, setdisabled] = useState(false)
    const [data, setdata] = useState([])
    const [key_value, setkey_value] = useState([])
    const [bus,setbus]=useState([])
    const history=useNavigate()

    function set_data(nums) {
        let arr1 = nums[0].person;
        let arr2 = nums[0].seat_record;
        let arr = []
        for (let i = 0; i < arr1.length; i++) {
            let obj = {
                personName: arr1[i],
                personSeat: arr2[i]
            }
            arr.push(obj)
        }
        setkey_value([...arr])
    }


    function submit() {
        setdata([])
        setwrongidNumber(false)
        setmessidNumber("")
        setbutton("Please Wait ...")
        setdisabled(true)
        
        fetch(`/getByid/${idNumber}`).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.length != 0) {
                fetch(`/bus_detail/${res[0].bus_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(responce => responce.json()).then((result) => {
                    if (result != undefined) {
                        setdata(res)
                        set_data(res)
                        setbus(result)
                        setbutton("Check")
                        setdisabled(false)
                    }
                }, (error) => {
                    setwrongidNumber(true)
                    setmessidNumber("Invalid PNR.")
                    setbutton("Check")
                    setdisabled(false)
                    history('*')
                })
            }
            else {
                setwrongidNumber(true)
                setmessidNumber("Invalid PNR.")
                setbutton("Check")
                setdisabled(false)
            }
        }, (error) => {
            setwrongidNumber(true)
            setmessidNumber("Invalid PNR.")
            setbutton("Check")
            setdisabled(false)
            history('*')
        })
    }

    return (
        <>
            <div className='d-flex align-items-center justify-content-center'>
                <div>
                    <div className="mt-3">
                        <div className="form-group">
                            <input type="text" onChange={(e) => { setidNumber(e.target.value) }} className="form-control" placeholder="Enter PNR Number" required />
                            {wrongidNumber ? <label style={{ color: "red" }}>{messidNumber}</label> : ""}
                        </div>
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-primary btn-sm" disabled={disabled} onClick={submit}>{button}</button>
                    </div>
                </div>
            </div>
            {
                data.length != 0 ?
                    <div className='container shadow mt-5'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Bus Name:- {bus[0].bus_name}</th>
                                    <th scope="col">Date: {data[0].date}</th>
                                    <th scope="col">Total Distance:- {data[0].total_distance} KM</th>
                                    <th scope="col">{data[0].src}  -  {data[0].dist}</th>
                                </tr>
                            </thead>
                            <thead >
                                <tr className='mt-5'>
                                    <th scope="col">SL No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Seat No.</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    key_value.map((item,ind)=>(
                                        <tr key={ind}>
                                            <th scope="row">{ind+1}</th>
                                            <td>Passanger {ind+1}</td>
                                            <td>{item.personSeat}</td>
                                            <td>{data[0].date}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    : ""
            }
        </>
    )
}

export default CheckStatus