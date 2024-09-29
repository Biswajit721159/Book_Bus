import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';

const api = process.env.REACT_APP_API;

const initialState = {
    'Email': '',
    'Src': '',
    'Dist': '',
    'BookingDate': '',
    'BusName': '',
    'currentPage': 1
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        addEmail: (state, action) => {
            state.Email = action.payload;
        },
        addSrc: (state, action) => {
            state.Src = action.payload;
        },
        addDist: (state, action) => {
            state.Dist = action.payload;
        },
        addBookingDate: (state, action) => {
            state.BookingDate = action.payload;
        },
        addBusName: (state, action) => {
            state.BusName = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
});

export const bookingApiSlice = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: api,
        prepareHeaders: (headers) => {
            const userinfo = JSON.parse(localStorage.getItem('user'));
            if (userinfo?.auth) {
                headers.set('Authorization', `Bearer ${userinfo.auth}`);
            }
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getBookings: builder.query({
            query: (data) => ({
                url: `Booking/pagination/?page=${data.currentPage}&Email=${data.Email}&Src=${data.Src}&Dist=${data.Dist}&BookingDate=${data.BookingDate}&BusName=${data.BusName}`,
                method: 'POST',
                body: JSON.stringify(data),
            }),
        }),
    }),
});

export const { useGetBookingsQuery } = bookingApiSlice;
export const { addEmail, addSrc, addDist, addBookingDate, addBusName, setCurrentPage } = bookingSlice.actions;
export const bookingReducer = bookingSlice.reducer;
