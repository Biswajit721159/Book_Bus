import React, { useEffect, useState } from "react";
import { getBookingForSuperAdmin } from "../utilities/busApi";
import CloseIcon from '@mui/icons-material/Close';
import { FullPageLoader } from "./FullPageLoader";
import { toast } from "react-toastify";
import { Pagination } from '@mui/material';
import ShowBookingData from "./ShowBookingData";

const Booking = () => {
    const [data, setData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState('');
    const [load, setLoad] = useState(false);

    const loadData = async (page = 1) => {
        setLoad(true);
        try {
            let res = await getBookingForSuperAdmin(page);
            setData(res.bookingData);
            setTotalPage(res.totalPage);
        } catch (e) {
            toast.warn(e.message);
        } finally {
            setLoad(false);
        }
    }

    const onChangePage = (e, page) => {
        setCurrentPage(page);
        loadData(page);
    }
    useEffect(() => {
        loadData();
    }, [])
    return (
        <>
            <div className="container mt-0 p-2 my-5">
                <div className="flex justify-end items-center">
                    <input
                        className="mt-4 mb-2 ml-3 mr-3 px-3 py-2 border rounded placeholder-gray-500 outline-blue-400 "
                        placeholder="Enter Id number"
                        value={id}
                        onChange={(e) => { setId(e.target.value) }}
                        spellCheck='false'
                    />

                    {id.length ?
                        <CloseIcon
                            fontSize="small"
                            className={`absolute mr-5 mt-3 w-0.5 h-0.5 text-sm cursor-pointer hover:bg-gray-200 rounded-lg`}
                            onClick={() => setId('')}
                        />
                        : ''}
                </div>
                <ShowBookingData data={data} />
            </div>
            {totalPage ?
                <Pagination
                    className='mt-5 mb-5'
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    count={totalPage}
                    onChange={onChangePage}
                    page={currentPage}
                    color="primary"
                /> :
                ""}
            <FullPageLoader open={load} />
        </>
    )
}
export default Booking;