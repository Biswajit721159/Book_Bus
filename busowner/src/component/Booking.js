import React, { useEffect, useState } from "react";
import { useGetBookingsQuery } from "../redux/bookingApiSlice";
import ShowBookingData from "./ShowBookingData";
import { FullPageLoader } from "./FullPageLoader";
import { toast } from "react-toastify";
import SearchingInput from "../Booking/SearchingInput";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from '../redux/bookingApiSlice';
import useDebounce from "../helpers/useDebounce";

const Booking = () => {
    const { Email, Src, Dist, BookingDate, BusName, currentPage } = useSelector((state) => state.booking);
    const [queryParams, setQueryParams] = useState({ currentPage, Email, Src, Dist, BookingDate, BusName });
    const dispatch = useDispatch();

    const updateQueryParams = useDebounce((newParams) => {
        setQueryParams(newParams);
    }, 500);

    useEffect(() => {
        dispatch(setCurrentPage(1));
        updateQueryParams({ currentPage: 1, Email, Src, Dist, BookingDate, BusName });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Email, Src, Dist, BookingDate, BusName]);

    useEffect(() => {
        updateQueryParams({ currentPage, Email, Src, Dist, BookingDate, BusName });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const { data, error, isFetching } = useGetBookingsQuery(queryParams);
    const bookingData = data?.data?.bookingData;
    const totalPage = data?.data?.totalPage;

    useEffect(() => {
        if (error) toast.warn(error.message || "An error occurred while fetching bookings");
    }, [error]);

    const onChangePage = (newPage) => {
        dispatch(setCurrentPage(newPage));
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-6">
                <h1 className="page-title">Booking Management</h1>
                <p className="text-sm text-slate-500 mt-0.5">Search and manage all passenger bookings</p>
            </div>

            {/* Search Filters */}
            <SearchingInput />

            {/* Results */}
            {bookingData && <ShowBookingData data={bookingData} />}

            {/* Pagination */}
            {totalPage > 1 && (
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
                    {Array.from({ length: Math.min(totalPage, 7) }, (_, i) => {
                        const p = i + 1;
                        return (
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
                        );
                    })}
                    <button
                        onClick={() => onChangePage(currentPage + 1)}
                        disabled={currentPage >= totalPage}
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

export default Booking;
