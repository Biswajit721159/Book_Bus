import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';

const api = process.env.REACT_APP_API;

const View_Bus = () => {
  const [data, setData] = useState();
  const [load, setLoad] = useState(true);
  const { _id } = useParams();
  const history = useNavigate();

  useEffect(() => {
    setLoad(true);
    fetch(`${api}/bus/bus_detail/${_id}`, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.statusCode === 200) {
          setLoad(false);
          setData(res.data);
        }
      })
      .catch(() => history('*'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (load) return <Loader text="Loading bus details..." />;

  const bus = data?.[0];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/BookBus" className="btn-ghost text-sm mb-4 inline-flex">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">{bus?.bus_name}</h1>
          <p className="text-sm text-surface-500 mt-1">Bus route and station details</p>
        </div>

        {/* Bus Info Card */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-surface-500 mb-1">Bus Name</p>
              <p className="font-semibold text-surface-900">{bus?.bus_name}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Total Seats</p>
              <p className="font-semibold text-surface-900">{bus?.Total_seat}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Total Stations</p>
              <p className="font-semibold text-surface-900">{bus?.station_data?.length}</p>
            </div>
            <div className="sm:col-span-3">
              <p className="text-xs text-surface-500 mb-1">Bus ID</p>
              <p className="font-mono text-sm text-surface-700 break-all">{bus?._id}</p>
            </div>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="card p-6">
          <h2 className="font-semibold text-surface-900 mb-6">Route Stations</h2>
          <div className="relative">
            {bus?.station_data?.map((item, ind) => {
              const isFirst = ind === 0;
              const isLast = ind === bus.station_data.length - 1;
              return (
                <div key={ind} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      isFirst ? 'bg-green-500 border-green-500' :
                      isLast ? 'bg-red-500 border-red-500' :
                      'bg-white border-primary-400'
                    }`} />
                    {!isLast && (
                      <div className="w-0.5 bg-surface-200 flex-1 my-1 min-h-[32px]" />
                    )}
                  </div>

                  {/* Station info */}
                  <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-semibold text-sm ${
                          isFirst ? 'text-green-700' :
                          isLast ? 'text-red-700' :
                          'text-surface-800'
                        }`}>
                          {item.station}
                          {isFirst && <span className="ml-2 badge badge-green text-xs">Origin</span>}
                          {isLast && <span className="ml-2 badge badge-red text-xs">Destination</span>}
                        </p>
                        <p className="text-xs text-surface-500 mt-0.5">
                          Arrives at <span className="font-medium text-surface-700">{item.arrived_time}</span>
                        </p>
                      </div>
                      {item.Distance_from_Previous_Station > 0 && (
                        <span className="badge badge-blue text-xs flex-shrink-0">
                          +{item.Distance_from_Previous_Station} km
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View_Bus;
