import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import Button from '@mui/material/Button';
const api = process.env.REACT_APP_API
const View_Ticket = () => {

    const userinfo = useSelector((state) => state.user)
    const { _id } = useParams();
    const history = useNavigate();
    const [load, setload] = useState(true)
    const [data, setdata] = useState([])
    const [key_value, setkey_value] = useState([])
    const [busname, setbusname] = useState("")

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

    function loaddata() {
        setload(true)
        fetch(`${api}/Booking/getTicketByid/${_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode === 200 && res.length != 0) {
                fetch(`${api}/bus/bus_detail/${res.data[0].bus_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(responce => responce.json()).then((result) => {
                    if (res != undefined && res.statusCode === 200) {
                        setload(false)
                        setdata(res.data)
                        set_data(res.data)
                        setbusname(result.data[0].bus_name)
                    }
                }, (error) => {
                    history('*')
                })
            }
            else {
                history('*')
            }
        }, (error) => {
            history('*')
        })
    }

    useEffect(() => {
        if (!userinfo?.user) {
            history('/Login')
        }
        else {
            loaddata()
        }
    }, [])

    function Downlode() {
        console.log("downlode pdf ")
    }

    return (
        <>
            {
                load == false ?
                    <div className='container shadow mt-5'>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Bus Name:-</th>
                                    <th scope="col">{busname}</th>
                                    <th scope="col">Total Distance:-</th>
                                    <th scope="col">{data[0].total_distance} km</th>
                                    <th scope="col">PNR NO - <Link style={{ textDecoration: "none" }}>{data[0]._id}</Link></th>
                                    <th>
                                        <Button variant="contained" color="primary" onClick={Downlode}>
                                            Downlode
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <td scope="col">Date</td>
                                    <td scope="col">{data[0].date}</td>
                                    <td scope="col">Total Money:-</td>
                                    <td scope="col">₹{data[0].total_money}</td>
                                    <td scope="col">{data[0].src}  -  {data[0].dist}</td>
                                </tr>
                            </thead>
                            <thead >
                                <tr className='mt-5'>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Seat No.</th>
                                    <th scope="col">Money</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    key_value.map((item, ind) => (
                                        <tr key={ind}>
                                            <th scope="row">{ind + 1}</th>
                                            <td>{item.personName}</td>
                                            <td>{item.personSeat}</td>
                                            <td>₹{parseInt(data[0].total_money) / parseInt(key_value.length)}</td>
                                            <td><button className='btn btn-danger btn-sm'>Cancel Ticket</button></td>
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

export default View_Ticket