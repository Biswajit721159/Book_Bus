import React, { useState } from "react";
import { convertUtcToIst } from "../helpers/USTtoIST";
import { useNavigate } from "react-router-dom";

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
                    {bookingData?.seat_record?.length ? (
                        bookingData.seat_record.map((seat, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">{seat}</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                        {bookingData?.person?.[index] || '—'}
                                    </span>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    bookingData?.status?.[index]
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {bookingData?.status?.[index] ? 'Booked' : 'Cancelled'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No seat data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ShowBookingData = ({ data }) => {
    const [modal, setModal] = useState({ open: false, data: {} });
    const navigate = useNavigate();

    if (!data?.length) {
        return (
            <div className="card p-12 text-center mt-4">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium">No bookings found</p>
                    <p className="text-xs">Try adjusting your search filters</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="card overflow-hidden mt-4">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Booking ID / Email</th>
                                <th>Timestamps</th>
                                <th>Bus</th>
                                <th>Route</th>
                                <th>Journey Date</th>
                                <th>Payment</th>
                                <th>Distance</th>
                                <th className="text-center">Passengers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <p className="font-mono text-xs text-slate-500 truncate max-w-[120px]">{item._id}</p>
                                        <p className="text-xs text-primary-600 mt-0.5">{item.useremail}</p>
                                    </td>
                                    <td>
                                        <p className="text-xs text-slate-500">
                                            <span className="font-medium text-slate-600">Created:</span> {convertUtcToIst(item.createdAt)}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            <span className="font-medium text-slate-600">Updated:</span> {convertUtcToIst(item.updatedAt)}
                                        </p>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/View_Bus/${item?.bus_id}`)}
                                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm hover:underline"
                                        >
                                            {item?.bus?.bus_name}
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-xs font-medium text-slate-700">{item.src}</span>
                                            <svg className="w-3 h-3 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            <span className="text-xs font-medium text-slate-700">{item.dist}</span>
                                        </div>
                                    </td>
                                    <td className="text-sm text-slate-600">{convertUtcToIst(item.date)}</td>
                                    <td>
                                        <span className="font-semibold text-emerald-600">₹{item.total_money}</span>
                                    </td>
                                    <td className="text-slate-500 text-sm">{item.total_distance} km</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => setModal({ open: true, data: item })}
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

            <PassengerModal
                open={modal.open}
                onClose={() => setModal({ open: false, data: {} })}
                bookingData={modal.data}
            />
        </>
    );
};

export default ShowBookingData;
