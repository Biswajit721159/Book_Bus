import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const api = process.env.REACT_APP_API;


export const loadStation = createAsyncThunk(
    'busTable/loadStation',
    async () => {
        try {
            const response = await fetch(`${api}/bus/get_station`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    }
);

export const loadBus = createAsyncThunk(
    'busTable/loadBus',
    async () => {
        try {
            const response = await fetch(`${api}/bus/getFirstTenBus/`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    }
);


export const fetchBusData = createAsyncThunk(
    'busTable/fetchBusData',
    async ({ src, dist }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api}/bus/get_bus`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start_station: src,
                    end_station: dist
                })
            });
            const data = await response.json();
            return data.data
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response.data);
        }
    }
);


const initialState = {
    Bus: [],
    station: [],
    loadingBus: false,
    loadingStation: false,
    error: null
};

const busTableSlice = createSlice({
    name: 'busTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadStation.pending, (state) => {
                state.loadingStation = true;
                state.error = null;
            })
            .addCase(loadStation.fulfilled, (state, action) => {
                state.loadingStation = false;
                state.station = action.payload;
            })
            .addCase(loadStation.rejected, (state, action) => {
                state.loadingStation = false;
                state.error = action.error.message;
            })
            .addCase(loadBus.pending, (state) => {
                state.loadingBus = true;
                state.error = null;
            })
            .addCase(loadBus.fulfilled, (state, action) => {
                state.loadingBus = false;
                state.Bus = action.payload;
            })
            .addCase(loadBus.rejected, (state, action) => {
                state.loadingBus = false;
                state.error = action.error.message;
            })
            .addCase(fetchBusData.pending, (state) => {
                state.loadingBus = true;
                state.loadingStation = true;
                state.error = null;
            })
            .addCase(fetchBusData.fulfilled, (state, action) => {
                state.loadingBus = false;
                state.loadingStation = false;
                state.Bus = action.payload;
            })
            .addCase(fetchBusData.rejected, (state, action) => {
                state.loadingBus = false;
                state.loadingStation = false;
                state.error = action.payload.errorMessage;
            });;

    }
});

export const BusTablemethod = busTableSlice.actions;
export default busTableSlice.reducer;

