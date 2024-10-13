import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FullPageLoader } from './FullPageLoader';
import { toast } from 'react-toastify'
import { convertUtcToIst } from '../helpers/USTtoIST';
import { Pagination } from '@mui/material';
import { getBuses } from '../utilities/busApi';
import { useSelector } from 'react-redux'
import ShowDataIntoTable from './ShowDataIntoTable';

const Adminpanel = () => {
    const [data, setdata] = useState([])
    const history = useNavigate();
    const userinfo = useSelector((state) => state.userAuth.user);
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const { otherUserinfo } = useSelector((state) => state.userAuth);
    
    useEffect(() => {
        if (userinfo === null) {
            history('/Login')
        } else if (otherUserinfo.role !== '100') {
            history('/')
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
                <ShowDataIntoTable data={data} />
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