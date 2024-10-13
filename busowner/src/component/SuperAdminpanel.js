import React, { useEffect, useState } from "react";
import { Checkbox } from '@mui/material'
import { FullPageLoader } from "../component/FullPageLoader"
import ShowDataIntoTable from "./ShowDataIntoTable";
import { Pagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    setIsApproved,
    setIsPending,
    setIsRejected,
    setTotalPages,
    setCurrentPage,
    useGetBussQuery,
} from "../redux/busSlice";

const SuperAdminpanel = () => {
    const { otherUserinfo } = useSelector((state) => state.userAuth);
    const history = useNavigate();
    const dispatch = useDispatch();
    const {
        isPending: pending, isApproved: approved, isRejected: rejected,
        totalPages, currentPage,
    } = useSelector((state) => state.busDetails);
    const [queryParams, setQueryParams] = useState({
        'page': currentPage,
        'approved': approved,
        'pending': pending,
        'rejected': rejected
    })
    let { data, error, isLoading, isFetching } = useGetBussQuery(queryParams);
    let totalPage = data?.data?.totalPage
    data = data?.data?.result;

    useEffect(() => {
        if (otherUserinfo.role !== '200') {
            history('/');
        }
        else {
            let page = currentPage;
            if (queryParams.pending && approved && !rejected) {
                page = 1;
                dispatch(setCurrentPage(page));
            } else if (queryParams.pending && rejected && !approved) {
                page = 1;
                dispatch(setCurrentPage(page));
            } else if (queryParams.approved && pending && !rejected) {
                page = 1;
                dispatch(setCurrentPage(page));
            } else if (queryParams.approved && rejected && !pending) {
                page = 1;
                dispatch(setCurrentPage(page));
            } else if (queryParams.rejected && approved && !pending) {
                page = 1;
                dispatch(setCurrentPage(page));
            } else if (queryParams.rejected && pending && !approved) {
                page = 1;
                dispatch(setCurrentPage(page));
            }
            setQueryParams((prev) => {
                return {
                    ...prev,
                    page: page,
                    approved: approved,
                    pending: pending,
                    rejected: rejected
                }
            });
        }
    }, [approved, pending, rejected, currentPage])

    useEffect(() => {
        dispatch(setTotalPages(totalPage));
    }, [data])

    useEffect(() => {
        if (error) {
            toast.warn(error.message || "An error occurred while fetching bookings");
        }
    }, [error]);

    function onChangePage(e, page) {
        dispatch(setCurrentPage(page));
    }

    return (
        <div>
            <div className="flex justify-center gap-3">
                <div>
                    <Checkbox
                        checked={approved}
                        onChange={(e) => {
                            dispatch(setIsApproved());
                        }}
                    />
                    <label>Approved</label>
                </div>
                <div>
                    <Checkbox checked={pending} onChange={(e) => {
                        dispatch(setIsPending())
                    }}
                    />
                    <label>Pending</label>
                </div>
                <div>
                    <Checkbox checked={rejected} onChange={(e) => {
                        dispatch(setIsRejected())
                    }}
                    />
                    <label>Rejected</label>
                </div>
            </div>
            <div>
                <ShowDataIntoTable data={data} />
            </div>
            {totalPages ? <Pagination
                className='mt-5 mb-5'
                sx={{ display: 'flex', justifyContent: 'center' }}
                count={totalPages}
                onChange={onChangePage}
                page={currentPage}
                color="primary"
            /> : ""}
            <FullPageLoader open={isFetching} />
        </div>
    )
}

export default SuperAdminpanel;