import React, { useState } from 'react';
import ShowPreviousHistory from './ShowPreviousHistory';
import { toast } from 'react-toastify';

const api = process.env.REACT_APP_API;

const CheckStatus = () => {
  const [idNumber, setIdNumber] = useState('');
  const [data, setData] = useState();
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem('searchHistory')) || []
  );
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!idNumber.trim()) {
      toast.warn('Please enter a valid booking ID');
      return;
    }
    setLoading(true);
    fetch(`${api}/Booking/getTicketForUnAuthUser/${idNumber}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.statusCode === 200) {
          setData(res.data);
          toast.success('Ticket found!');
          addToHistory(idNumber);
        } else {
          toast.warn('No ticket found with this ID');
        }
        setLoading(false);
      })
      .catch(() => {
        toast.warn('Something went wrong. Please try again.');
        setLoading(false);
      });
  };

  const addToHistory = (id) => {
    const newHistory = [id, ...searchHistory.filter((el) => el !== id)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const deletePreviousHistory = (id) => {
    const newHistory = searchHistory.filter((el) => el !== id);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const onClickSearchHistory = (id) => {
    setIdNumber(id);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Check Ticket Status</h1>
          <p className="text-surface-500 text-sm mt-2">Enter your booking ID to check the status of your ticket</p>
        </div>

        {/* Search */}
        <div className="card p-6 mb-6">
          <label className="label">Booking ID</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="input-field flex-1 font-mono"
              placeholder="Enter your booking ID..."
              spellCheck={false}
            />
            <button
              onClick={submit}
              disabled={loading}
              className="btn-primary px-6"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking...</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Check
                </>
              )}
            </button>
          </div>
        </div>

        <ShowPreviousHistory
          searchHistory={searchHistory}
          deletePreviousHistory={deletePreviousHistory}
          onClickSearchHistory={onClickSearchHistory}
        />

        {/* Result */}
        {data && (
          <div className="card overflow-hidden mt-6 animate-slide-up">
            {/* Journey Summary */}
            <div className="px-6 py-5 bg-primary-50 border-b border-primary-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-primary-600 font-medium mb-1">Bus Name</p>
                  <p className="font-semibold text-surface-900 text-sm">{data.bus_name}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-600 font-medium mb-1">Route</p>
                  <p className="font-semibold text-surface-900 text-sm">{data.src} → {data.dist}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-600 font-medium mb-1">Booking Date</p>
                  <p className="font-semibold text-surface-900 text-sm">{data.booking_date}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-600 font-medium mb-1">Distance</p>
                  <p className="font-semibold text-surface-900 text-sm">{data.total_distance} km</p>
                </div>
              </div>
            </div>

            {/* Passengers Table */}
            <div className="table-container border-0 shadow-none rounded-none">
              <table className="table-base">
                <thead className="table-head">
                  <tr>
                    <th className="table-th">#</th>
                    <th className="table-th">Passenger</th>
                    <th className="table-th">Seat No.</th>
                    <th className="table-th">Travel Date</th>
                    <th className="table-th">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-100">
                  {data.seat_record?.map((seat, ind) => (
                    <tr key={ind} className="table-row">
                      <td className="table-td text-surface-500">{ind + 1}</td>
                      <td className="table-td font-medium text-surface-800">Passenger {ind + 1}</td>
                      <td className="table-td">
                        {data.status?.[ind] ? (
                          <span className="badge badge-blue">Seat {seat}</span>
                        ) : (
                          <span className="badge badge-red">Cancelled</span>
                        )}
                      </td>
                      <td className="table-td text-surface-700">{data.date}</td>
                      <td className="table-td">
                        {data.status?.[ind] ? (
                          <span className="badge badge-green">Active</span>
                        ) : (
                          <span className="badge badge-red">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStatus;
