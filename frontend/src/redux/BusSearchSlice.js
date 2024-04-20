import { createSlice } from '@reduxjs/toolkit'

function getSourceStation() {
    let src = localStorage.getItem('src')
    if (src === null) {
        localStorage.setItem('src', JSON.stringify(''));
        return ''
    }
    else {
        return JSON.parse(src)
    }
}

function getDistinationStation() {
    let dist = localStorage.getItem('dist');
    if (dist === null) {
        localStorage.setItem('dist', JSON.stringify(''));
        return ''
    }
    else {
        return JSON.parse(dist)
    }
}

const BusSearchSlice = createSlice({
    name: 'BusSearch',
    initialState: {
        src: getSourceStation(),
        dist: getDistinationStation()
    },

    reducers: {
        Addsrc: (state, action) => {
            state.src = action.payload;
            localStorage.setItem('src', JSON.stringify(action.payload))
        },
        adddist: (state, action) => {
            state.dist = action.payload
            localStorage.setItem('dist', JSON.stringify(action.payload))
        }
    },
})


export const BusSearchmethod = BusSearchSlice.actions
const BusSearchReducer = BusSearchSlice.reducer
export default BusSearchReducer