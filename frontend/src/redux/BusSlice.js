import { createSlice } from '@reduxjs/toolkit'

const BusTableSlice = createSlice({
    name: 'BusTable',
    initialState: {
        bus: []
    },

    reducers: {
        Add_Bus: (state, action) => {
            state.bus = action.payload;
        }
    },
})


export const BusTablemethod = BusTableSlice.actions
const BusTableReducer = BusTableSlice.reducer
export default BusTableReducer