import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import { bookingApiSlice, bookingReducer } from "./bookingApiSlice";
import busReducer, { busApiSlice } from "./busSlice";
import { userApiSlice } from "./UserApi";

export default configureStore({
    reducer: {
        userAuth: userReducer,
        booking: bookingReducer,
        [bookingApiSlice.reducerPath]: bookingApiSlice.reducer,
        busDetails: busReducer,
        [busApiSlice.reducerPath]: busApiSlice.reducer,
        [userApiSlice.reducerPath]: userApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(bookingApiSlice.middleware, busApiSlice.middleware, userApiSlice.middleware),
});