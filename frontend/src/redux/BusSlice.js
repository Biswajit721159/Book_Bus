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
    async (station) => {
        try {
            const response = await fetch(`${api}/bus/get_bus`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start_station: station.src,
                    end_station: station.dist
                })
            });
            const data = await response.json();
            return data.data
        } catch (error) {
            console.log(error)
            throw error;
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
    reducers: {
        DurationEarlyFirst: (state, payload) => {
            let bus = payload?.payload;
            let sortedBuses = [...bus].sort((a, b) => {
                let fa = HourToMin(a?.total_time);
                let fb = HourToMin(b?.total_time);

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses;
        },
        DurationLateFirst: (state, payload) => {
            let bus = payload?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = HourToMin(a?.total_time)
                let fb = HourToMin(b?.total_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        DepartureEarlyFirst: (state, payload) => {
            let bus = payload?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.end_arrive_time)
                let fb = finMinutes(b?.end_arrive_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        DepartureLateFirst: (state, payload) => {
            let bus = payload?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.end_arrive_time)
                let fb = finMinutes(b?.end_arrive_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        ArrivalEarlyFirst: (state, payload) => {
            let bus = payload?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.start_arrived_time)
                let fb = finMinutes(b?.start_arrived_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        },
        ArrivalLateFirst: (state, payload) => {
            let bus = payload?.payload;
            let sortedBuses = [...bus]?.sort((a, b) => {
                let fa = finMinutes(a?.start_arrived_time)
                let fb = finMinutes(b?.start_arrived_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            state.Bus = sortedBuses
        }
    },
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
                state.error = action?.payload?.errorMessage;
            });;

    }
});

function HourToMin(s) {
    let count = 0;
    let ans = 0;
    let i = 0;
    let n = s.length
    while (i < n && s[i] != 'h') {
        count = count * 10 + (s[i] - '0');
        i++;
    }
    ans += (count * 60);
    i += 2;
    count = 0;
    while (i < n && s[i] != 'm') {
        count = count * 10 + (s[i] - '0');
        i++;
    }
    ans += count;
    return ans;
}

function finMinutes(s) {
    let hh = s.substr(0, 2);
    let mm = s.substr(3, 2);

    hh = parseInt(hh);
    mm = parseInt(mm);
    return (hh * 60 + mm)
}

export const BusTablemethod = busTableSlice.actions;
export default busTableSlice.reducer;

