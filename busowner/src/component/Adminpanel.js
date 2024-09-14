import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FullPageLoader } from './FullPageLoader';
import { toast } from 'react-toastify'
import { convertUtcToIst } from '../helpers/USTtoIST';
import { Pagination } from '@mui/material';
import { getBuses } from '../utilities/busApi';
import { useSelector } from 'react-redux'

const Adminpanel = () => {
    const [data, setdata] = useState([])
    const history = useNavigate();
    const userinfo = useSelector((state) => state.userAuth.user);
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    useEffect(() => {
        if (userinfo === null) {
            history('/Login')
        }
        else {
            if (userinfo) loadData();
        }
    }, [])


    async function loadData(page = 1) {
        try {
            setLoad(true);
            let response = await getBuses(page);
            if (response?.statusCode) {
                setdata(response?.data?.data);
                setTotalPage(response?.data?.totalPage);
            } else {
                toast(response?.message);
            }
            setLoad(false);
        } catch (e) {
            toast.warn(e?.message);
            setLoad(false);
        }
    }

    function onChangePage(e, page) {
        setPage(page);
        loadData(page);
    }


    return (
        <>
            <div className='container'>
                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th className='text-center text-gray-500' scope="col">#</th>
                            <th className='text-center text-gray-500' scope="col">Bus Name</th>
                            <th className='text-center text-gray-500' scope="col">Total Seat</th>
                            <th className='text-center text-gray-500' scope="col">Src To Dist</th>
                            <th className='text-center text-gray-500' scope="col">Create At</th>
                            <th className='text-center text-gray-500' scope="col">Action Taken</th>
                            <th className='text-center text-gray-500' >view</th>
                            <th className='text-center text-gray-500' >edit</th>
                            <th className='text-center text-gray-500' >delete</th>
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
                                    <td className='text-center' >{convertUtcToIst(item?.createdAt)}</td>
                                    <td className='text-center' >
                                        <button className='px-3 p-1 bg-blue-500 rounded-md hover:bg-blue-600 text-white text-sm' disabled>{item?.status}</button>
                                    </td>
                                    <td className='text-center' >
                                        <Link to={`/View_Bus/${item?._id}`}>
                                            <button className='px-3 p-1 bg-orange-500 rounded-md hover:bg-orange-600 text-white text-sm'>View</button>
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
                {totalPage ? <Pagination
                    className='mt-5 mb-5'
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    count={totalPage}
                    onChange={onChangePage}
                    page={page}
                    color="primary"
                /> : ""}
            </div>
            <FullPageLoader open={load} />
        </>
    )
}

export default Adminpanel