import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEmail, addSrc, addDist, addBookingDate, addBusName } from "../redux/bookingApiSlice";

const FIELDS = [
    { name: 'Email', placeholder: 'Email address', type: 'text', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Src', placeholder: 'Source', type: 'text', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Dist', placeholder: 'Destination', type: 'text', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { name: 'BusName', placeholder: 'Bus name', type: 'text', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { name: 'BookingDate', placeholder: 'Booking date', type: 'date', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const actionMap = {
    Email: addEmail,
    Src: addSrc,
    Dist: addDist,
    BookingDate: addBookingDate,
    BusName: addBusName,
};

const SearchingInput = () => {
    const { Email, Src, Dist, BookingDate, BusName } = useSelector((state) => state.booking);
    const dispatch = useDispatch();

    const values = { Email, Src, Dist, BookingDate, BusName };

    const handleChange = (name, value) => {
        dispatch(actionMap[name](value));
    };

    const clearField = (name) => handleChange(name, '');

    return (
        <div className="card p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">Filter Bookings</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {FIELDS.map((field) => (
                    <div key={field.name} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                            </svg>
                        </div>
                        <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name]}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="input-field pl-8 pr-7 text-xs"
                            spellCheck="false"
                        />
                        {values[field.name] && field.type !== 'date' && (
                            <button
                                onClick={() => clearField(field.name)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                aria-label={`Clear ${field.name}`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchingInput;
