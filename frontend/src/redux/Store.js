import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/UserSlice'

export default configureStore({

    reducer: {
        user: userReducer,
    },


});