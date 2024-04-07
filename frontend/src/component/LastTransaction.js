import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import Loader from './Loader'
const api = process.env.REACT_APP_API
const LastTransaction = () => {

    const userinfo = useSelector((state) => state.user)
    const history = useNavigate();
    const [data, setdata] = useState([])
    const [load, setload] = useState(true)

    function loadTicket() {
        fetch(`${api}/Booking/getTicket/${userinfo?.user?.user?.email}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode===200) {
                setload(false)
                setdata(res.data)
            }
        }, (error) => {
            console.log(error)
            history('*')
        })
    }

    useEffect(() => {
        if (!userinfo?.user?.auth) {
            history('/Login')
        }
        else {
            loadTicket();
        }
    }, [])

    return (
        <>
            {
                load == false ?
                    <div className='container mt-5'>
                        {data.length ? <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Source</th>
                                    <th scope="col">Dastination</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Total Money</th>
                                    <th scope="col">View Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.length && data.map((item, ind) => (
                                        <tr className='' key={ind}>
                                            <th scope="row">{ind + 1}</th>
                                            <td>{item.src}</td>
                                            <td>{item.dist}</td>
                                            <td>{item.date}</td>
                                            <td>₹{item.total_money}</td>
                                            <td><Link to={`/${item._id}`}><button className='btn btn-primary btn-sm'>View more</button></Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                            : "No Transaction Found"
                        }
                    </div>
                    : <Loader />
            }
        </>
    )
}

export default LastTransaction