import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/UserSlice'
import BusSearchReducer from "./BusSearchSlice";
export default configureStore({

    reducer: {
        user: userReducer,
        BusSearch:BusSearchReducer,
    },


});