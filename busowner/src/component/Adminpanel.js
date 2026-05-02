import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getBuses } from '../utilities/busApi';
import { useSelector } from 'react-redux';
import ShowDataIntoTable from './ShowDataIntoTable';
import { FullPageLoader } from './FullPageLoader';

const Adminpanel = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const userinfo = useSelector((state) => state.userAuth.user);
    const { otherUserinfo } = useSelector((state) => state.userAuth);
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        if (userinfo === null) {
            navigate('/Login');
        } else if (otherUserinfo.role !== '100') {
            navigate('/');
        } else {
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadData(p = 1) {
        try {
            setLoad(true);
            const response = await getBuses(p);
            if (response?.statusCode) {
                setData(response?.data?.data);
                setTotalPage(response?.data?.totalPage);
            } else {
                toast.warn(response?.message);
            }
        } catch (e) {
            toast.warn(e?.message);
        } finally {
            setLoad(false);
        }
    }

    function onChangePage(newPage) {
        setPage(newPage);
        loadData(newPage);
    }

    return (
        <div className="page-container">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="page-title">My Buses</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage and track all your registered buses</p>
                </div>
                <button
                    onClick={() => navigate('/BusAdder')}
                    className="btn-primary"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Bus
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-600">{data?.length ?? 0}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Total Buses</span>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <span className="text-lg font-bold text-emerald-600">{totalPage}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Total Pages</span>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                        <span className="text-lg font-bold text-violet-600">{page}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Current Page</span>
                </div>
            </div>

            {/* Table */}
            <ShowDataIntoTable data={data} />

            {/* Pagination */}
            {totalPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => onChangePage(page - 1)}
                        disabled={page <= 1}
                        className="btn-secondary px-3 py-2 disabled:opacity-40"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => onChangePage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                p === page
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => onChangePage(page + 1)}
                        disabled={page >= totalPage}
                        className="btn-secondary px-3 py-2 disabled:opacity-40"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            <FullPageLoader open={load} />
        </div>
    );
};

export default Adminpanel;
