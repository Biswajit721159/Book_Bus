import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from './Loader';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { loadStation, loadBus, fetchBusData } from '../redux/BusSlice';
import Searching from './Searching';
import Filter from './Filter';

const api = process.env.REACT_APP_API;

/* ─── Bus Result Card ─────────────────────────────────────────────────────── */
const BusCard = ({ item, date, onShowSeat, busState }) => {
  const isActive = busState.bus__id === item.bus_id;
  const price = item.total_distance * 5;
  const isLoading = isActive && busState.disabled_showseat;
  const hasResult = isActive && busState.seat_res_come;
  const seatsLeft = busState.Available_seat;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-400" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-surface-900 text-base leading-tight">{item.bus_name}</h3>
              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Available
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-surface-900">₹{price}</p>
            <p className="text-xs text-surface-400">per seat</p>
          </div>
        </div>

        {/* Route timeline */}
        <div className="flex items-center gap-2 mb-4 bg-surface-50 rounded-xl px-4 py-3">
          {/* Departure */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-surface-900 truncate">{item.start_arrived_time}</p>
            <p className="text-xs font-medium text-primary-600 truncate">{item.start_station}</p>
          </div>

          {/* Duration line */}
          <div className="flex flex-col items-center flex-shrink-0 px-2">
            <span className="text-xs text-surface-400 font-medium mb-1">{item.total_time}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-primary-400 bg-white" />
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-primary-400 to-primary-300 relative">
                <svg className="absolute -right-1 -top-1.5 w-3 h-3 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary-500" />
            </div>
            <span className="text-xs text-surface-400 mt-1">{item.total_distance} km</span>
          </div>

          {/* Arrival */}
          <div className="flex-1 min-w-0 text-right">
            <p className="text-lg font-bold text-surface-900 truncate">{item.end_arrive_time}</p>
            <p className="text-xs font-medium text-primary-600 truncate">{item.end_station}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {item.total_distance} km
          </div>
          <div className="w-1 h-1 rounded-full bg-surface-300" />
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.total_time}
          </div>
          {hasResult && (
            <>
              <div className="w-1 h-1 rounded-full bg-surface-300" />
              <div className={`flex items-center gap-1.5 text-xs font-medium ${seatsLeft > 0 ? 'text-green-600' : 'text-red-500'}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold out'}
              </div>
            </>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pt-3 border-t border-surface-100">
          <Link to={`/View_Bus/${item.bus_id}`} className="flex-shrink-0">
            <button className="btn-secondary btn-sm gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Details
            </button>
          </Link>

          <div className="flex-1 flex items-center justify-end gap-2">
            {!isActive || (!isLoading && !hasResult) ? (
              <button
                onClick={() => onShowSeat(item.bus_id, item.start_station, item.end_station)}
                className="btn-primary btn-sm gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Check Seats
              </button>
            ) : isLoading ? (
              <button disabled className="btn-primary btn-sm opacity-70 cursor-not-allowed gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </button>
            ) : hasResult && seatsLeft > 0 ? (
              <Link to={`/${item.bus_id}/${item.start_station}/${item.end_station}/${date}`}>
                <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors duration-150 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Book Now
                </button>
              </Link>
            ) : (
              <button
                onClick={() => onShowSeat(item.bus_id, item.start_station, item.end_station)}
                className="btn-secondary btn-sm gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Home Page ───────────────────────────────────────────────────────────── */
const Home = () => {
  const date = useSelector((state) => state.BusSearch.date);
  const src = useSelector((state) => state.BusSearch.src);
  const dist = useSelector((state) => state.BusSearch.dist);
  const history = useNavigate();
  const dispatch = useDispatch();
  const { Bus, station, loadingBus, loadingStation } = useSelector((state) => state.Bus);

  const [busState, setBusState] = useState({
    bus__id: '',
    disabled_showseat: false,
    Available_seat: 0,
    seat_res_come: false,
  });

  useEffect(() => {
    if (Bus?.length === 0 && src?.length !== 0 && dist?.length !== 0) {
      dispatch(fetchBusData({ src, dist }));
    } else if (Bus?.length === 0) {
      dispatch(loadBus());
    }
    if (station?.length === 0) dispatch(loadStation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const show_seat = (_id, srcStation, distStation) => {
    if (date.length < 10) {
      swal('Please select a travel date first!');
      return;
    }
    if (srcStation === distStation) {
      swal('Source and Destination cannot be the same');
      return;
    }
    setBusState((prev) => ({
      ...prev,
      bus__id: _id,
      seat_res_come: false,
      disabled_showseat: true,
    }));

    fetch(`${api}/Booking/get_Seat`, {
      method: 'PATCH',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_station: srcStation,
        end_station: distStation,
        date,
        bus_id: _id,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.statusCode === 200) {
          setBusState((prev) => ({
            ...prev,
            Available_seat: res.data.nowAvailable_seat,
            disabled_showseat: false,
            seat_res_come: true,
          }));
        } else {
          setBusState((prev) => ({ ...prev, disabled_showseat: false }));
        }
      })
      .catch(() => history('*'));
  };

  if (loadingBus || loadingStation) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      {/* Hero search panel */}
      <Searching />

      {/* Filter bar — only when results exist */}
      {Bus?.length > 0 && <Filter />}

      {/* Results area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Bus?.length > 0 ? (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-surface-900">
                  {Bus.length} {Bus.length === 1 ? 'Bus' : 'Buses'} Available
                </h2>
                {src && dist && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-surface-500">{src}</span>
                    <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-sm text-surface-500">{dist}</span>
                    {date && (
                      <>
                        <span className="text-surface-300">·</span>
                        <span className="text-sm font-semibold text-primary-600">{date}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bus cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Bus.map((item, ind) => (
                <BusCard
                  key={ind}
                  item={item}
                  date={date}
                  onShowSeat={show_seat}
                  busState={busState}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-surface-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Search for a route above</h3>
            <p className="text-surface-500 text-sm max-w-sm leading-relaxed">
              Select your source, destination, and travel date to find available buses on your route.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
