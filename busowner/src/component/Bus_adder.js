import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddBus } from "../utilities/busApi";
import { toast } from "react-toastify";
import { FullPageLoader } from "./FullPageLoader";

const Bus_adder = () => {
    const userinfo = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!userinfo) navigate('/Login');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [name, setName] = useState("");
    const [seat, setSeat] = useState("");
    const [station, setStation] = useState("");
    const [arrivedTime, setArrivedTime] = useState("");
    const [distance, setDistance] = useState("");
    const [isLastStation, setIsLastStation] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [stationList, setStationList] = useState([]);
    const [load, setLoad] = useState(false);
    const [step, setStep] = useState(1); // 1 = bus info, 2 = stations

    function addToList() {
        if (!station.trim() || !arrivedTime) {
            toast.warn("Please fill in station name and arrival time.");
            return;
        }
        setShowSubmit(isLastStation);
        setStationList([...stationList, {
            station: station.trim().toUpperCase(),
            arrived_time: arrivedTime,
            Distance_from_Previous_Station: Number(distance) || 0,
        }]);
        setStation("");
        setArrivedTime("");
        setDistance("");
        setIsLastStation(false);
    }

    function deleteStation(idx) {
        const updated = [...stationList];
        updated.splice(idx, 1);
        setStationList(updated);
        if (showSubmit) setShowSubmit(false);
    }

    async function submit() {
        if (!name.trim() || !seat) {
            toast.warn("Bus name and seat count are required.");
            return;
        }
        if (stationList.length < 2) {
            toast.warn("Please add at least 2 stations.");
            return;
        }
        try {
            setLoad(true);
            const res = await AddBus(name, seat, stationList);
            if (res.statusCode === 201) {
                toast.success(res?.message);
                navigate('/');
            } else {
                toast.warn(res?.message);
            }
        } catch (e) {
            toast.warn(e.message);
        } finally {
            setLoad(false);
        }
    }

    function proceedToStations() {
        if (!name.trim()) { toast.warn("Enter a bus name."); return; }
        if (!seat || Number(seat) < 1) { toast.warn("Enter a valid seat count."); return; }
        setStep(2);
    }

    return (
        <div className="page-container max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="btn-icon text-slate-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="page-title">Add New Bus</h1>
                    <p className="text-sm text-slate-500">Fill in bus details and define the route stations</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-8">
                {['Bus Details', 'Route Stations'].map((label, i) => (
                    <React.Fragment key={i}>
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                step > i + 1 ? 'bg-emerald-500 text-white' :
                                step === i + 1 ? 'bg-primary-600 text-white' :
                                'bg-slate-200 text-slate-500'
                            }`}>
                                {step > i + 1 ? (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : i + 1}
                            </div>
                            <span className={`text-sm font-medium ${step === i + 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </div>
                        {i < 1 && <div className="flex-1 h-px bg-slate-200" />}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Bus Info */}
            {step === 1 && (
                <div className="card p-6 animate-fade-in">
                    <h2 className="section-title mb-4">Bus Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Bus Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Express Deluxe"
                            />
                        </div>
                        <div>
                            <label className="input-label">Total Seats</label>
                            <input
                                type="number"
                                className="input-field"
                                value={seat}
                                onChange={(e) => setSeat(e.target.value)}
                                placeholder="e.g. 40"
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button onClick={proceedToStations} className="btn-primary">
                            Next: Add Stations
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Stations */}
            {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                    {/* Bus Summary */}
                    <div className="card p-4 flex items-center gap-4 bg-primary-50 border-primary-200">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{name}</p>
                            <p className="text-sm text-slate-500">{seat} seats · {stationList.length} station{stationList.length !== 1 ? 's' : ''} added</p>
                        </div>
                        <button onClick={() => setStep(1)} className="ml-auto text-xs text-primary-600 hover:underline">Edit</button>
                    </div>

                    {/* Station List */}
                    {stationList.length > 0 && (
                        <div className="card overflow-hidden">
                            <div className="card-header flex items-center justify-between">
                                <h3 className="section-title">Route Stations</h3>
                                <span className="text-xs text-slate-400">{stationList.length} station{stationList.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Station</th>
                                            <th>Arrival Time</th>
                                            <th>Distance (km)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stationList.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="text-slate-400 font-medium">{idx + 1}</td>
                                                <td className="font-medium text-slate-800">{item.station}</td>
                                                <td className="text-slate-600">{item.arrived_time}</td>
                                                <td className="text-slate-600">{item.Distance_from_Previous_Station} km</td>
                                                <td>
                                                    <button
                                                        onClick={() => deleteStation(idx)}
                                                        className="btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Add Station Form */}
                    {!showSubmit && (
                        <div className="card p-6">
                            <h3 className="section-title mb-4">
                                {stationList.length === 0 ? 'Add First Station' : 'Add Next Station'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="input-label">Station Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={station}
                                        onChange={(e) => setStation(e.target.value.toUpperCase())}
                                        placeholder="e.g. MUMBAI"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Arrival Time (24h)</label>
                                    <input
                                        type="time"
                                        className="input-field"
                                        value={arrivedTime}
                                        onChange={(e) => setArrivedTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Distance from Prev. (km)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={distance}
                                        onChange={(e) => setDistance(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isLastStation}
                                        onChange={(e) => setIsLastStation(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-slate-600">This is the last station</span>
                                </label>
                                <button onClick={addToList} className="btn-primary">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Station
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    {showSubmit && (
                        <div className="card p-6 text-center bg-emerald-50 border-emerald-200">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">Route Complete</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                {stationList.length} stations defined. Submit to register your bus.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setShowSubmit(false)}
                                    className="btn-secondary"
                                >
                                    Add More Stations
                                </button>
                                <button
                                    onClick={submit}
                                    disabled={load}
                                    className="btn-success"
                                >
                                    {load ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Submit Bus
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <FullPageLoader open={load} />
        </div>
    );
};

export default Bus_adder;
