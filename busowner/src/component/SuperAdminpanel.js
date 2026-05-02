import React, { useEffect, useState } from "react";
import { FullPageLoader } from "../component/FullPageLoader";
import ShowDataIntoTable from "./ShowDataIntoTable";
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

const FILTERS = [
    { key: 'pending', label: 'Pending', action: setIsPending, color: 'amber' },
    { key: 'approved', label: 'Approved', action: setIsApproved, color: 'emerald' },
    { key: 'rejected', label: 'Rejected', action: setIsRejected, color: 'red' },
];

const SuperAdminpanel = () => {
    const { otherUserinfo } = useSelector((state) => state.userAuth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        isPending: pending, isApproved: approved, isRejected: rejected,
        totalPages, currentPage,
    } = useSelector((state) => state.busDetails);

    const [queryParams, setQueryParams] = useState({
        page: currentPage,
        approved,
        pending,
        rejected,
    });

    let { data, error, isFetching } = useGetBussQuery(queryParams);
    let totalPage = data?.data?.totalPage;
    data = data?.data?.result;

    useEffect(() => {
        if (otherUserinfo.role !== '200') {
            navigate('/');
            return;
        }
        let page = currentPage;
        const changed = (
            (queryParams.pending && approved && !rejected) ||
            (queryParams.pending && rejected && !approved) ||
            (queryParams.approved && pending && !rejected) ||
            (queryParams.approved && rejected && !pending) ||
            (queryParams.rejected && approved && !pending) ||
            (queryParams.rejected && pending && !approved)
        );
        if (changed) {
            page = 1;
            dispatch(setCurrentPage(page));
        }
        setQueryParams({ page, approved, pending, rejected });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approved, pending, rejected, currentPage]);

    useEffect(() => {
        dispatch(setTotalPages(totalPage));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (error) toast.warn(error.message || "An error occurred while fetching buses");
    }, [error]);

    function onChangePage(newPage) {
        dispatch(setCurrentPage(newPage));
    }

    const activeFilter = pending ? 'pending' : approved ? 'approved' : 'rejected';

    return (
        <div className="page-container">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">Bus Management</h1>
                <p className="text-sm text-slate-500 mt-0.5">Review and approve bus registrations</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
                {FILTERS.map(({ key, label, action, color }) => {
                    const isActive = activeFilter === key;
                    const colorMap = {
                        amber: isActive ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-amber-600',
                        emerald: isActive ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-600',
                        red: isActive ? 'bg-red-500 text-white shadow-sm' : 'text-slate-600 hover:text-red-600',
                    };
                    return (
                        <button
                            key={key}
                            onClick={() => dispatch(action())}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${colorMap[color]}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <ShowDataIntoTable data={data} />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => onChangePage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="btn-secondary px-3 py-2 disabled:opacity-40"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => onChangePage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                p === currentPage
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => onChangePage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="btn-secondary px-3 py-2 disabled:opacity-40"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            <FullPageLoader open={isFetching} />
        </div>
    );
};

export default SuperAdminpanel;
