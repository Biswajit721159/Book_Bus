import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../stylesheet/CheckStatus.css'
const api = process.env.REACT_APP_API

const CheckStatus = () => {

    const [idNumber, setidNumber] = useState(0)
    const [wrongidNumber, setwrongidNumber] = useState(false)
    const [messidNumber, setmessidNumber] = useState("")
    const [button, setbutton] = useState("check status")
    const [disabled, setdisabled] = useState(false)
    const [data, setdata] = useState()
    const [key_value, setkey_value] = useState([])
    const history = useNavigate()



    function submit() {
        setdata()
        setwrongidNumber(false)
        setmessidNumber("")
        setbutton("please wait ...")
        setdisabled(true)

        fetch(`${api}/Booking/getTicketForUnAuthUser/${idNumber}`).then(responce => responce.json()).then((res) => {
            if (res != undefined && res?.statusCode === 200) {
                setdata(res?.data)
                setkey_value(res?.data?.seat_record)
                setbutton("check status")
                setdisabled(false)
            }
            else {
                setwrongidNumber(true)
                setmessidNumber("Invalid value")
                setbutton("check status")
                setdisabled(false)
            }
        }, (error) => {
            setwrongidNumber(true)
            setmessidNumber("Invalid value")
            setbutton("check status")
            setdisabled(false)
            history('*')
        })
    }


    return (
        <>
            <div className='checkstatus mt-3'>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'row' }}>
                    <input type="text" onChange={(e) => { setidNumber(e.target.value) }} className="checkinputfrom" placeholder="Enter Id Number" required />
                    <button className="btn btn-primary" id='checkbtn' disabled={disabled} onClick={submit}>{button}</button>
                </div>
                {wrongidNumber ? <label style={{ color: "red", marginTop: '2px' }}>{messidNumber}</label> : ""}
            </div>

            {
                data ?
                    <div className='container shadow mt-5'>
                        < table className="table" >
                            <thead>
                                <tr>
                                    <th scope="col">Bus Name : {data?.bus_name}</th>
                                    <th scope="col">Booking Date : {data?.booking_date}</th>
                                    <th scope="col">Total Distance : {data?.total_distance} km</th>
                                    <th scope="col">{data?.src}  -  {data?.dist}</th>
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
                                    key_value?.map((item, ind) => (
                                        <tr key={ind}>
                                            <th scope="row">{ind + 1}</th>
                                            <td>passanger {ind + 1}</td>
                                            <td>{item}</td>
                                            <td>{data?.date}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table >
                    </div >
                    : ""
            }
        </>
    )
}

export default CheckStatus