import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import { bookingApiSlice, bookingReducer } from "./bookingApiSlice";
export default configureStore({
    reducer: {
        userAuth: userReducer,
        booking: bookingReducer,
        [bookingApiSlice.reducerPath]: bookingApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(bookingApiSlice.middleware),
});