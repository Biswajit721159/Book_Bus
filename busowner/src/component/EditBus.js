import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertUtcToIst } from '../helpers/USTtoIST';
import { editBus } from '../utilities/busApi';
import { toast } from 'react-toastify';
import { FullPageLoader } from './FullPageLoader';
import { useSelector } from 'react-redux';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', activeCls: 'border-transparent text-white bg-amber-500', dotActive: 'bg-white', dotInactive: 'bg-amber-500' },
    { value: 'approved', label: 'Approved', activeCls: 'border-transparent text-white bg-emerald-500', dotActive: 'bg-white', dotInactive: 'bg-emerald-500' },
    { value: 'rejected', label: 'Rejected', activeCls: 'border-transparent text-white bg-red-500', dotActive: 'bg-white', dotInactive: 'bg-red-500' },
];

const EditBus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(location.state?.data || {});
    const [load, setLoad] = useState(false);
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const isSuperAdmin = otherUserinfo?.role === '200';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStationChange = (index, e) => {
        const { name, value } = e.target;
        const updated = data.station_data.map((s, i) =>
            i === index
                ? { ...s, [name]: name === 'Distance_from_Previous_Station' ? parseInt(value) || 0 : value.toUpperCase() }
                : s
        );
        setData((prev) => ({ ...prev, station_data: updated }));
    };

    const addStation = () => {
        setData((prev) => ({
            ...prev,
            station_data: [...prev.station_data, { station: '', arrived_time: '', Distance_from_Previous_Station: 0 }],
        }));
    };

    const removeStation = (index) => {
        setData((prev) => ({
            ...prev,
            station_data: prev.station_data.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoad(true);
            const res = await editBus(data);
            if (res.statusCode === 200) {
                toast.success(res.message);
                navigate(-1);
            } else {
                toast.warn(res?.message);
            }
        } catch (e) {
            toast.warn(e?.message);
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className="page-container max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="btn-icon text-slate-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="page-title">Edit Bus</h1>
                    <p className="text-sm text-slate-500">Update bus details and route information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Meta Info Card */}
                <div className="card p-6">
                    <h2 className="section-title mb-4">Bus Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="input-label">Bus ID</label>
                            <input className="input-field" value={data._id || ''} disabled />
                        </div>
                        <div>
                            <label className="input-label">Created At</label>
                            <input className="input-field" value={convertUtcToIst(data.createdAt)} disabled />
                        </div>
                        <div>
                            <label className="input-label">Updated At</label>
                            <input className="input-field" value={convertUtcToIst(data.updatedAt)} disabled />
                        </div>
                        <div>
                            <label className="input-label">Owner Email</label>
                            <input className="input-field" value={data.email || ''} disabled />
                        </div>
                        <div>
                            <label className="input-label">Bus Name</label>
                            <input
                                className="input-field"
                                name="bus_name"
                                value={data.bus_name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="input-label">Total Seats</label>
                            <input
                                type="number"
                                className="input-field"
                                name="Total_seat"
                                value={data.Total_seat || ''}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                        {isSuperAdmin && (
                            <div>
                                <label className="input-label">Status</label>
                                <div className="flex gap-2 mt-1">
                                    {STATUS_OPTIONS.map(({ value, label, activeCls, dotActive, dotInactive }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData((prev) => ({ ...prev, status: value }))}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                                                data.status === value
                                                    ? activeCls
                                                    : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${data.status === value ? dotActive : dotInactive}`} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stations Card */}
                <div className="card overflow-hidden">
                    <div className="card-header flex items-center justify-between">
                        <h2 className="section-title">Route Stations</h2>
                        <button
                            type="button"
                            onClick={addStation}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Station
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        {data.station_data?.map((station, index) => (
                            <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                            <span className="text-xs font-semibold text-primary-700">{index + 1}</span>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">Station {index + 1}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeStation(index)}
                                        className="btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="input-label">Station Name</label>
                                        <input
                                            className="input-field"
                                            name="station"
                                            value={station.station || ''}
                                            onChange={(e) => handleStationChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Arrival Time</label>
                                        <input
                                            type="time"
                                            className="input-field"
                                            name="arrived_time"
                                            value={station.arrived_time || ''}
                                            onChange={(e) => handleStationChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Distance from Prev. (km)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            name="Distance_from_Previous_Station"
                                            value={station.Distance_from_Previous_Station ?? 0}
                                            onChange={(e) => handleStationChange(index, e)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn-success" disabled={load}>
                        {load ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            <FullPageLoader open={load} />
        </div>
    );
};

export default EditBus;
