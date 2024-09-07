import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import loader from "../images/loader.gif"
import { FullPageLoader } from './FullPageLoader';
import { toast } from 'react-toastify'
const api = process.env.REACT_APP_API

const Home = () => {
    const [data, setdata] = useState([])
    const history = useNavigate();
    const userinfo = JSON.parse(localStorage.getItem('user'))
    const [load, setload] = useState(true)

    useEffect(() => {
        if (userinfo == null) {
            history('/Login')
        }
        else {
            loadData()
        }
    }, [])


    function loadData() {
        setload(true)
        fetch(`${api}/busowner/getBusByEmail/${userinfo.user.email}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                auth: `Bearer ${userinfo.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            setdata(res.data);
            setload(false);
            toast.success("successfully found!")
        }, (error) => {
            setload(false);
        })
    }


    return (
        <>
            {
                load == false ?
                    <div className='container'>
                        <table className="table mt-5">
                            <thead>
                                <tr>
                                    <th className='text-center' scope="col">#</th>
                                    <th className='text-center' scope="col">Bus Name</th>
                                    <th className='text-center' scope="col">Total Seat</th>
                                    <th className='text-center' scope="col">Src To Dist</th>
                                    <th className='text-center' scope="col">Action Taken</th>
                                    <th className='text-center' >view</th>
                                    <th className='text-center' >edit</th>
                                    <th className='text-center' >delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, ind) => (
                                        <tr key={ind}>
                                            <th className='text-center' scope="row">{ind + 1}</th>
                                            <td className='text-center'>{item?.bus_name}</td>
                                            <td className='text-center' >{item?.Total_seat}</td>
                                            <th className='text-center'>*{item?.station_data[0]?.station} - {item?.station_data[(item?.station_data?.length) - 1]?.station}</th>
                                            <td className='text-center' >
                                                <button className='px-3 p-1 bg-blue-500 rounded-md hover:bg-blue-600 text-white text-sm' disabled>{item?.status}</button>
                                            </td>
                                            <td className='text-center' >
                                                <Link to={`/View_Bus/${item?._id}`}>
                                                    <button className='px-3 p-1 bg-orange-500 rounded-md hover:bg-orange-600 text-white text-sm'>View More</button>
                                                </Link>
                                            </td>
                                            <td className='text-center'>
                                                <button className='px-3 p-1 bg-sky-500 rounded-md hover:bg-sky-600 text-white text-sm' >Edit</button>
                                            </td>
                                            <td className='text-center'>
                                                <button className='px-3 p-1 bg-red-500 rounded-md hover:bg-red-600 text-white text-sm' >Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <FullPageLoader open={load} />
            }
        </>
    )
}

export default Home