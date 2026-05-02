import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import Loader from './Loader';
import { useSelector, useDispatch } from 'react-redux';
import { usermethod } from '../redux/UserSlice';
import { toast } from 'react-toastify';

const api = process.env.REACT_APP_API;

const SeatLegend = () => (
  <div className="flex items-center gap-4 flex-wrap">
    {[
      { color: 'bg-white border-surface-200', label: 'Available' },
      { color: 'bg-primary-100 border-primary-500', label: 'Selected' },
      { color: 'bg-red-50 border-red-200', label: 'Booked' },
    ].map((l) => (
      <div key={l.label} className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded border-2 ${l.color}`} />
        <span className="text-xs text-surface-600">{l.label}</span>
      </div>
    ))}
  </div>
);

const Ticket_Book = () => {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user);
  const history = useNavigate();
  const { src, dist, date, bus_id } = useParams();

  const [submitload, setSubmitload] = useState(false);
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const [seatarr, setSeatarr] = useState([]);
  const [MasterList, setMasterList] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [pay, setPay] = useState(0);
  const [total_distance, setTotalDistance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const markseat = (id) => {
    if (data[id - 1].isbooked === 'Both') {
      const newArr = seatarr.filter((s) => s !== id);
      setSeatarr(newArr);
      return true;
    } else {
      if (seatarr.length >= 5) return false;
      if (seatarr.length >= MasterList.length) return false;
      setSeatarr([...seatarr, id]);
      return true;
    }
  };

  const Mark = (id) => {
    if (markseat(id)) {
      const idx = id - 1;
      const newData = [...data];
      newData[idx] = { ...newData[idx], isbooked: newData[idx].isbooked === false ? 'Both' : false };
      setData(newData);
    } else {
      if (seatarr.length >= MasterList.length) {
        swal(`Your MasterList has ${MasterList.length} passenger(s)`);
      } else {
        swal('Sorry, maximum 5 seats are allowed!');
      }
    }
  };

  const show_seat = () => {
    setLoad(true);
    fetch(`${api}/Booking/get_Seat`, {
      method: 'PATCH',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_station: src, end_station: dist, date, bus_id }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.statusCode === 200) {
          fetch(`${api}/MasterList/${userinfo?.user?.user?._id}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userinfo?.user?.auth}`,
            },
          })
            .then((r) => r.json())
            .then((result) => {
              if (result?.statusCode === 200) {
                setMasterList(result.data);
                setLoad(false);
                setData(res.data.BookingRecord);
                setTotalDistance(res.data.total_distance);
              } else if (result.statusCode === 498) {
                dispatch(usermethod.Logout_User());
                history('/Login');
              } else {
                history('*');
              }
            })
            .catch(() => history('*'));
        } else if (res.statusCode === 498) {
          dispatch(usermethod.Logout_User());
          history('/Login');
        } else {
          history('*');
        }
      })
      .catch(() => history('*'));
  };

  const handleCheckboxChange = (name) => {
    if (checkbox.includes(name)) {
      setCheckbox(checkbox.filter((c) => c !== name));
      setPay((p) => p - total_distance * 5);
    } else if (checkbox.length >= seatarr.length) {
      swal(`You selected ${seatarr.length} seat(s). Please select exactly that many passengers.`);
    } else {
      setCheckbox([...checkbox, name]);
      setPay((p) => p + total_distance * 5);
    }
  };

  const checkAlreadyGetOrNot = (nums) => {
    for (let i = 0; i < seatarr.length; i++) {
      if (nums[seatarr[i] - 1].isbooked === true) return true;
    }
    return false;
  };

  const checkAlreadyBoth = () => {
    for (let i = 0; i < seatarr.length; i++) {
      if (data[seatarr[i] - 1].isbooked !== 'Both') return false;
    }
    return true;
  };

  const submit = () => {
    const trimmedSeatarr = seatarr.slice(0, checkbox.length);
    if (checkAlreadyBoth() && checkbox.length === trimmedSeatarr.length) {
      setSubmitload(true);
      fetch(`${api}/Booking/get_Seat`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_station: src, end_station: dist, date, bus_id }),
      })
        .then((r) => r.json())
        .then((comeres) => {
          if (comeres?.statusCode === 200) {
            if (!checkAlreadyGetOrNot(comeres.data.BookingRecord)) {
              fetch(`${api}/Booking`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userinfo?.user?.auth}`,
                },
                body: JSON.stringify({
                  bus_id,
                  src,
                  dist,
                  useremail: userinfo.user.user.email,
                  total_money: pay,
                  date,
                  seat_record: trimmedSeatarr,
                  person: checkbox,
                  total_distance,
                }),
              })
                .then((r) => r.json())
                .then((res) => {
                  if (res?.statusCode === 201) {
                    history('/LastTransaction');
                  } else if (res?.statusCode === 498) {
                    dispatch(usermethod.Logout_User());
                    history('/Login');
                  } else {
                    toast.warn(res?.message);
                    history('*');
                  }
                })
                .catch(() => history('*'));
            } else {
              swal('Sorry, your seat was taken by another user. Please select a different seat.');
              setSubmitload(false);
              show_seat();
              setCheckbox([]);
              setSeatarr([]);
            }
          } else if (comeres?.statusCode === 498) {
            dispatch(usermethod.Logout_User());
            history('/Login');
          } else {
            setSubmitload(false);
            show_seat();
            setCheckbox([]);
            setSeatarr([]);
          }
        })
        .catch(() => history('/'));
    } else {
      swal('Please select passengers for all chosen seats.');
    }
  };

  useEffect(() => {
    if (!userinfo.user) {
      history('/Login');
    } else {
      show_seat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userinfo]);

  if (submitload) return <Loader text="Confirming your booking..." />;
  if (load) return <Loader text="Loading seat map..." />;

  const rows = [];
  for (let i = 0; i < data.length; i += 4) {
    rows.push(data.slice(i, i + 4));
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Select Your Seats</h1>
          <p className="text-surface-500 text-sm mt-1">
            {src} → {dist} &nbsp;·&nbsp; {date}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-surface-900">Seat Map</h2>
                <SeatLegend />
              </div>

              {/* Bus front indicator */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 rounded-lg text-xs text-surface-500 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
                  </svg>
                  Driver
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {data.map((item, ind) => {
                  const seatNum = ind + 1;
                  const isBooked = item.isbooked === true;
                  const isSelected = item.isbooked === 'Both';

                  return (
                    <button
                      key={ind}
                      onClick={() => !isBooked && Mark(seatNum)}
                      disabled={isBooked}
                      className={`
                        relative flex flex-col items-center justify-center rounded-xl border-2 h-14 text-sm font-semibold
                        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
                        ${isBooked
                          ? 'seat-booked cursor-not-allowed'
                          : isSelected
                          ? 'seat-selected shadow-sm'
                          : 'seat-available'
                        }
                      `}
                      aria-label={`Seat ${seatNum} ${isBooked ? '(booked)' : isSelected ? '(selected)' : '(available)'}`}
                    >
                      <span>{seatNum}</span>
                      {isBooked && (
                        <svg className="w-3 h-3 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isSelected && (
                        <svg className="w-3 h-3 mt-0.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {seatarr.length > 0 && (
                <div className="mt-6 pt-5 border-t border-surface-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-surface-600">
                        <span className="font-semibold text-surface-900">{seatarr.length}</span> seat(s) selected
                        <span className="mx-2 text-surface-300">·</span>
                        Seats: <span className="font-medium text-primary-700">{seatarr.join(', ')}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="btn-primary"
                    >
                      Continue
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-surface-900 mb-4">Journey Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'From', value: src },
                  { label: 'To', value: dist },
                  { label: 'Date', value: date },
                  { label: 'Distance', value: `${total_distance} km` },
                  { label: 'Price/seat', value: `₹${total_distance * 5}` },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between items-center">
                    <span className="text-xs text-surface-500">{d.label}</span>
                    <span className="text-sm font-medium text-surface-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-surface-900 mb-3">Passengers Available</h3>
              {MasterList.length > 0 ? (
                <div className="space-y-2">
                  {MasterList.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-surface-700">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                        {p.name[0].toUpperCase()}
                      </div>
                      {p.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-500">No passengers in your list. Add passengers in the Passengers section.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Selection Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-box p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Assign Passengers</h2>
                <p className="text-xs text-surface-500 mt-0.5">Select one passenger per seat</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="table-container">
                <table className="table-base">
                  <thead className="table-head">
                    <tr>
                      <th className="table-th">#</th>
                      <th className="table-th">Passenger Name</th>
                      <th className="table-th">Select</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-surface-100">
                    {MasterList.map((item, ind) => (
                      <tr key={ind} className="table-row">
                        <td className="table-td text-surface-500">{ind + 1}</td>
                        <td className="table-td font-medium text-surface-800">{item.name}</td>
                        <td className="table-td">
                          <button
                            onClick={() => handleCheckboxChange(item.name)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                              checkbox.includes(item.name)
                                ? 'bg-primary-600 border-primary-600'
                                : 'border-surface-300 hover:border-primary-400'
                            }`}
                          >
                            {checkbox.includes(item.name) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-surface-500">Selected seats</p>
                    <p className="text-sm font-semibold text-surface-900">{seatarr.length} seat(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Passengers assigned</p>
                    <p className="text-sm font-semibold text-surface-900">{checkbox.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Total amount</p>
                    <p className="text-lg font-bold text-green-700">₹{pay}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-surface-100">
              <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={checkbox.length === 0 || checkbox.length !== seatarr.length}
                className="btn-primary flex-1"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket_Book;
