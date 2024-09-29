import React, { useEffect, useState } from "react";
import { useGetBookingsQuery } from "../redux/bookingApiSlice";
import { Pagination } from '@mui/material';
import ShowBookingData from "./ShowBookingData";
import { FullPageLoader } from "./FullPageLoader";
import { toast } from "react-toastify";
import SearchingInput from "../Booking/SearchingInput";
import { useSelector } from "react-redux";
import { debounce } from 'lodash';

const Booking = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { Email, Id, BookingDate, BusName } = useSelector((state) => state.booking);
    const [queryParams, setQueryParams] = useState({ currentPage, Email, Id, BookingDate, BusName });

    const updateQueryParams = debounce((newParams) => {
        setQueryParams(newParams);
    }, 100);

    useEffect(() => {
        updateQueryParams({ currentPage, Email, Id, BookingDate, BusName });
    }, [currentPage, Email, Id, BookingDate, BusName]);

    const { data, error, isLoading, isFetching } = useGetBookingsQuery(queryParams);

    const bookingData = data?.data?.bookingData;
    const totalPage = data?.data?.totalPage;

    useEffect(() => {
        if (error) {
            toast.warn(error.message || "An error occurred while fetching bookings");
        }
    }, [error]);

    const onChangePage = (e, page) => {
        setCurrentPage(page);
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
