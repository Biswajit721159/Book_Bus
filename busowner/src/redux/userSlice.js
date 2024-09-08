import { createSlice } from '@reduxjs/toolkit'

function fetchInitialData() {
    let user = localStorage.getItem('user');
    if (user === null) {
        return null
    } else {
        return JSON.parse(user)
    }
}

function Set_UserData(data) {
    localStorage.setItem('user', JSON.stringify(data))
}

function Clear_User() {
    localStorage.removeItem('user')
}


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: fetchInitialData(),
        otherUserinfo: {
            role: '',
        }
    },

    reducers: {
        Add_User: (state, action) => {
            state.user = action.payload;
            Set_UserData(action.payload);
            state.otherUserinfo.role = action.payload.user?.role;
        },
        Logout_User: (state, action) => {
            state.user = null
            state.otherUserinfo = {
                role: ''
            }
            Clear_User()
        },
        setUserInfo: (state, action) => {
            state.otherUserinfo.role = action.payload.role;
        },
    },
})


export const usermethod = userSlice.actions
const userReducer = userSlice.reducer
export default userReducer