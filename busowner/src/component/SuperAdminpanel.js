import React, { useEffect, useState } from "react";
import { Checkbox } from '@mui/material'
import { findBusByFilter } from "../utilities/busApi";
import { FullPageLoader } from "../component/FullPageLoader"
import ShowDataIntoTable from "./ShowDataIntoTable";
import { Pagination } from '@mui/material';
const SuperAdminpanel = () => {
    const [approved, setApproved] = useState(true);
    const [pending, setPending] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        loadData();
    }, [approved, pending, rejected])

    const loadData = async (page = 1) => {
        try {
            setLoad(true);
            let report = await findBusByFilter(page, approved, pending, rejected);
            setData(report?.result);
            setTotalPages(report?.totalPage);
        } catch (e) {

        } finally {
            setLoad(false);
        }
    }
    function onChangePage(e, page) {
        setPage(page);
        loadData(page);
    }

    return (
        <div>
            <div className="flex justify-center gap-3">
                <div>
                    <Checkbox
                        checked={approved}
                        onChange={(e) => {
                            setApproved(e.target.checked);
                            setPending(false);
                            setRejected(false);
                        }}
                    />
                    <label>Approved</label>
                </div>
                <div>
                    <Checkbox checked={pending} onChange={(e) => {
                        setApproved(false);
                        setPending(e.target.checked);
                        setRejected(false);
                    }}
                    />
                    <label>Pending</label>
                </div>
                <div>
                    <Checkbox checked={rejected} onChange={(e) => {
                        setApproved(false);
                        setPending(false);
                        setRejected(e.target.checked);
                    }}
                    />
                    <label>Rejected</label>
                </div>
            </div>
            <div>
                <ShowDataIntoTable data={data} />
            </div>
            {totalPages ? <Pagination
                className='mt-5'
                sx={{ display: 'flex', justifyContent: 'center' }}
                count={totalPages}
                onChange={onChangePage}
                page={page}
                color="primary"
            /> : ""}
            <FullPageLoader open={load} />
        </div>
    )
}

export default SuperAdminpanel;