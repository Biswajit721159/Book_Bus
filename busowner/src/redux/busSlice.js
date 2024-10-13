import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';

const api = process.env.REACT_APP_API;

const initialState = {
    pendingBuss: [],
    approvedBuss: [],
    rejectedBuss: [],
    isPending: true,
    isApproved: false,
    isRejected: false,
    totalPages: 0,
    currentPage: 1,
}

const busSlice = createSlice({
    name: 'bus',
    initialState,
    reducers: {
        setIsPending: (state, action) => {
            state.isPending = true;
            state.isApproved = false;
            state.isRejected = false;
        },
        setIsApproved: (state, action) => {
            state.isPending = false;
            state.isApproved = true;
            state.isRejected = false;
        },
        setIsRejected: (state, action) => {
            state.isPending = false;
            state.isApproved = false;
            state.isRejected = true;
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        addPendingBus: (state, action) => {
            let bus = action.payload;
            state.pendingBuss.push(bus);
        },
        addApprovedBus: (state, action) => {
            let bus = action.payload;
            state.approvedBuss.push(bus);
        },
        addRejectedBus: (state, action) => {
            let bus = action.payload;
            state.rejectedBuss.push(bus);
        },
        removePendingBus: (state, action) => {
            let index = action.payload;
            state.pendingBuss = state.pendingBuss.splice(index, 1);
        },
        removeApprovedBus: (state, action) => {
            let index = action.payload;
            state.approvedBuss = state.approvedBuss.splice(index, 1);
        },
        removeRejectedBus: (state, action) => {
            let index = action.payload;
            state.rejectedBuss = state.rejectedBuss.splice(index, 1);
        }
    }
})

export const busApiSlice = createApi({
    reducerPath: 'busApi',
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
        getBuss: builder.query({
            query: ({ page, approved, pending, rejected }) => ({
                url: `${api}/businfo/findBussByFilter/?page=${encodeURIComponent(page)}&approved=${encodeURIComponent(approved)}&pending=${encodeURIComponent(pending)}&rejected=${encodeURIComponent(rejected)}`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useGetBussQuery } = busApiSlice;

export const {
    setIsPending,
    setIsApproved,
    setIsRejected,
    setTotalPage,
    setTotalPages,
    setCurrentPage,
    addPendingBus,
    addApprovedBus,
    addRejectedBus,
    removePendingBus,
    removeRejectedBus,
    removeApprovedBus
} = busSlice.actions;
const busReducer = busSlice.reducer
export default busReducer;