import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getBusById } from '../utilities/busApi';
import { FullPageLoader } from './FullPageLoader';
import { toast } from 'react-toastify';

const View_Bus = () => {
    const location = useLocation();
    const [data, setData] = useState(location.state?.data || {});
    const [load, setLoad] = useState(false);
    const { _id } = useParams();
    const navigate = useNavigate();

    async function loadBus() {
        try {
            setLoad(true);
            const res = await getBusById(_id);
            setData(res.data);
        } catch (e) {
            toast.warn(e.message);
            navigate('*');
        } finally {
            setLoad(false);
        }
    }

    useEffect(() => {
        try {
            if (Object.keys(location.state?.data || {}).length === 0) loadBus();
        } catch {
            loadBus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stations = data?.station_data || [];

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
                    <h1 className="page-title">{data?.bus_name || 'Bus Details'}</h1>
                    <p className="text-sm text-slate-500">Route and station information</p>
                </div>
            </div>

            {!load && (
                <div className="space-y-5 animate-fade-in">
                    {/* Bus Info Card */}
                    <div className="card p-6">
                        <h2 className="section-title mb-4">Bus Overview</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Bus Name', value: data?.bus_name },
                                { label: 'Bus ID', value: data?._id, mono: true },
                                { label: 'Total Stations', value: stations.length },
                                { label: 'Total Seats', value: data?.Total_seat },
                            ].map((item, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className={`text-sm font-semibold text-slate-800 truncate ${item.mono ? 'font-mono text-xs' : ''}`}>
                                        {item.value || '—'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Route Timeline */}
                    {stations.length > 0 && (
                        <div className="card p-6">
                            <h2 className="section-title mb-5">Route Timeline</h2>
                            <div className="relative">
                                {stations.map((item, ind) => (
                                    <div key={ind} className="flex gap-4 relative">
                                        {/* Timeline line */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                                                ind === 0 ? 'bg-emerald-500' :
                                                ind === stations.length - 1 ? 'bg-red-500' :
                                                'bg-primary-500'
                                            }`}>
                                                <span className="text-xs font-bold text-white">{ind + 1}</span>
                                            </div>
                                            {ind < stations.length - 1 && (
                                                <div className="w-0.5 flex-1 bg-slate-200 my-1 min-h-[24px]" />
                                            )}
                                        </div>

                                        {/* Station Info */}
                                        <div className={`pb-5 flex-1 ${ind === stations.length - 1 ? 'pb-0' : ''}`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-800">{item.station}</p>
                                                    <p className="text-sm text-slate-500 mt-0.5">
                                                        Arrival: <span className="font-medium text-slate-700">{item.arrived_time}</span>
                                                    </p>
                                                </div>
                                                {ind > 0 && (
                                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                        +{item.Distance_from_Previous_Station} km
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <FullPageLoader open={load} />
        </div>
    );
};

export default View_Bus;
