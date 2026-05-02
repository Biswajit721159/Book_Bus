import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FullPageLoader } from "./FullPageLoader";
import { useSelector } from "react-redux";
import { getBussByEmail, getBookingStatus } from "../utilities/busApi";
import { toast } from "react-toastify";
import { searchData } from "../helpers/searching";

const today = new Date().toISOString().split('T')[0];

const PassengerModal = ({ open, onClose, bookingData }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm animate-fade-in">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Seats & Passengers</h3>
                    <button onClick={onClose} className="btn-icon text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
                    {bookingData?.seat_record?.map((seat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary-700">{seat}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-700">{bookingData?.person?.[index]}</span>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                bookingData?.status?.[index]
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {bookingData?.status?.[index] ? 'Booked' : 'Cancelled'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ViewSeat = () => {
    const userinfo = useSelector((state) => state.userAuth.user);
    const navigate = useNavigate();
    const [busData, setBusData] = useState([]);
    const [load, setLoad] = useState(true);
    const [date, setDate] = useState(today);
    const [selectedBus, setSelectedBus] = useState("");
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [passengerModal, setPassengerModal] = useState({ open: false, data: {} });

    useEffect(() => {
        if (!userinfo) { navigate('/Login'); return; }
        loadBuses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const filtered = searchId ? searchData(bookings, searchId, '_id') : bookings;
        setFilteredBookings(filtered);
    }, [searchId, bookings]);

    async function loadBuses() {
        try {
            setLoad(true);
            const res = await getBussByEmail();
            if (res?.data) setBusData(res.data);
        } catch (e) {
            toast.warn(e.message);
        } finally {
            setLoad(false);
        }
    }

    async function findBookings(e) {
        e.preventDefault();
        if (!selectedBus) { toast.warn("Please select a bus."); return; }
        if (!date) { toast.warn("Please select a date."); return; }
        const busId = busData.find((b) => b.bus_name === selectedBus)?._id;
        if (!busId) { toast.warn("Bus not found."); return; }
        try {
            setLoad(true);
            const res = await getBookingStatus(date, busId);
            if (res.data) {
                setBookings(res.data);
                setFilteredBookings(res.data);
            } else {
                setBookings([]);
                setFilteredBookings([]);
            }
        } catch (e) {
            toast.warn(e.message);
        } finally {
            setLoad(false);
        }
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-6">
                <h1 className="page-title">View Seat Availability</h1>
                <p className="text-sm text-slate-500 mt-0.5">Search bookings by bus and date</p>
            </div>

            {/* Search Form */}
            <div className="card p-5 mb-6">
                <form onSubmit={findBookings} className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                        <label className="input-label">Select Bus</label>
                        <select
                            className="input-field"
                            value={selectedBus}
                            onChange={(e) => setSelectedBus(e.target.value)}
                            required
                        >
                            <option value="">Choose a bus...</option>
                            {busData.map((item, i) => (
                                <option key={i} value={item.bus_name}>{item.bus_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="input-label">Journey Date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={date}
                            min={today}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary h-[42px] px-6" disabled={load}>
                        {load ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Results */}
            {filteredBookings.length > 0 && (
                <div className="space-y-4">
                    {/* Search Filter */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found</p>
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="input-field pl-9 w-56"
                                placeholder="Filter by booking ID..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                            {searchId && (
                                <button
                                    onClick={() => setSearchId('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Source</th>
                                        <th>Destination</th>
                                        <th>Payment</th>
                                        <th>Distance</th>
                                        <th className="text-center">Passengers</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((item, ind) => (
                                        <tr key={ind}>
                                            <td className="font-mono text-xs text-slate-500">{item._id}</td>
                                            <td className="font-medium text-slate-700">{item.src}</td>
                                            <td className="font-medium text-slate-700">{item.dist}</td>
                                            <td>
                                                <span className="font-semibold text-emerald-600">₹{item.total_money}</span>
                                            </td>
                                            <td className="text-slate-500">{item.total_distance} km</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => setPassengerModal({ open: true, data: item })}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View Seats
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {filteredBookings.length === 0 && bookings.length === 0 && !load && selectedBus && (
                <div className="card p-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm font-medium">No bookings found for this date</p>
                    </div>
                </div>
            )}

            <PassengerModal
                open={passengerModal.open}
                onClose={() => setPassengerModal({ open: false, data: {} })}
                bookingData={passengerModal.data}
            />
            <FullPageLoader open={load} />
        </div>
    );
};

export default ViewSeat;
