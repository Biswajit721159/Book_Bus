import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'bus',
    initialState: {
        bus: []
    },

    reducers: {
        Add_Bus: (state, action) => {
            state.bus = action.payload;
            Set_UserData(action.payload)
        },
        Logout_User: (state, action) => {
            state.user = ""
            Clear_User()
        }
    },
})


export const usermethod = userSlice.actions
const userReducer = userSlice.reducer
export default userReducer