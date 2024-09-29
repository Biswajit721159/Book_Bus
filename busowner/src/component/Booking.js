import React, { useEffect, useState } from "react";
import { useGetBookingsQuery } from "../redux/bookingApiSlice";
import { Pagination } from '@mui/material';
import ShowBookingData from "./ShowBookingData";
import { FullPageLoader } from "./FullPageLoader";
import { toast } from "react-toastify";
import SearchingInput from "../Booking/SearchingInput";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import { setCurrentPage } from '../redux/bookingApiSlice'
import useDebounce from "../helpers/useDebounce";

const Booking = () => {
    const { Email, Src, Dist, BookingDate, BusName, currentPage } = useSelector((state) => state.booking);
    const [queryParams, setQueryParams] = useState({ currentPage, Email, Src, Dist, BookingDate, BusName });
    const dispatch = useDispatch();

    const updateQueryParams = useDebounce((newParams) => {
        setQueryParams(newParams);
    }, 500);

    useEffect(() => {
        setCurrentPage(1);
        dispatch(setCurrentPage(1));
        updateQueryParams({ currentPage: 1, Email, Src, Dist, BookingDate, BusName });
    }, [Email, Src, Dist, BookingDate, BusName]);

    useEffect(() => {
        updateQueryParams({ currentPage, Email, Src, Dist, BookingDate, BusName });
    }, [currentPage])

    const { data, error, isLoading, isFetching } = useGetBookingsQuery(queryParams);
    const bookingData = data?.data?.bookingData;
    const totalPage = data?.data?.totalPage;

    useEffect(() => {
        if (error) {
            toast.warn(error.message || "An error occurred while fetching bookings");
        }
    }, [error]);

    const onChangePage = (e, page) => {
        dispatch(setCurrentPage(page));
    };

    return (
        <>
            <div className="container mt-0 p-2 my-5">
                <SearchingInput />
                {bookingData ? <ShowBookingData data={bookingData} /> : null}
            </div>
            {totalPage > 0 && (
                <Pagination
                    className='mt-5 mb-5'
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    count={totalPage}
                    onChange={onChangePage}
                    page={currentPage}
                    color="primary"
                />
            )}
            <FullPageLoader open={isFetching} />
        </>
    );
};

export default Booking;
