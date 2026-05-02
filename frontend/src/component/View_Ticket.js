import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import Loader from './Loader';
import { usermethod } from '../redux/UserSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = process.env.REACT_APP_API;

const View_Ticket = () => {
  const userinfo = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { _id } = useParams();
  const history = useNavigate();

  const [load, setLoad] = useState(true);
  const [data, setData] = useState();
  const [key_value, setKeyValue] = useState();
  const [isFavouriteJourney, setIsFavouriteJourney] = useState(false);
  const [FavouriteJourneyLoader, setFavouriteJourneyLoader] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [formData, setFormData] = useState();
  const [cancelLoading, setCancelLoading] = useState(false);

  const set_data = (nums) => {
    const arr = nums.person.map((name, i) => ({
      personName: name,
      personSeat: nums.seat_record[i],
      status: nums.status[i],
    }));
    setKeyValue(arr);
  };

  const loaddata = () => {
    setLoad(true);
    fetch(`${api}/Booking/getTicketByid/${_id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo?.user?.auth}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        setLoad(false);
        if (res?.statusCode === 200) {
          setData(res.data);
          set_data(res.data);
          setIsFavouriteJourney(res.data.isFavouriteJourney);
        } else if (res.statusCode === 498) {
          dispatch(usermethod.Logout_User());
          history('/Login');
        } else {
          history('*');
        }
      })
      .catch((error) => {
        setLoad(false);
        toast.warn(error?.message);
        history('*');
      });
  };

  useEffect(() => {
    if (!userinfo?.user) {
      history('/Login');
    } else {
      loaddata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddToFavouriteJourney = () => {
    setFavouriteJourneyLoader(true);
    fetch(`${api}/FavouriteJourney/AddFavouriteJourney`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo?.user?.auth}`,
      },
      body: JSON.stringify({ email: userinfo?.user?.user?.email, booking_id: _id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.statusCode === 201) setIsFavouriteJourney(true);
        else if (d?.statusCode === 498) { dispatch(usermethod.Logout_User()); history('/Login'); }
        setFavouriteJourneyLoader(false);
      })
      .catch(() => setFavouriteJourneyLoader(false));
  };

  const RemoveFromFavouriteJourney = () => {
    setFavouriteJourneyLoader(true);
    fetch(`${api}/FavouriteJourney/RemoveFavouriteJourney/${_id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo?.user?.auth}`,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.statusCode === 200) setIsFavouriteJourney(false);
        else if (d?.statusCode === 498) { dispatch(usermethod.Logout_User()); history('/Login'); }
        setFavouriteJourneyLoader(false);
      })
      .catch(() => setFavouriteJourneyLoader(false));
  };

  const cancelTicket = async () => {
    try {
      setCancelLoading(true);
      const response = await axios.patch(`${api}/Booking/cancelTicket`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userinfo?.user?.auth}`,
        },
      });
      set_data(response.data?.data);
      closeModal();
      setCancelLoading(false);
      toast.success('Ticket cancelled successfully');
    } catch {
      history('*');
      setCancelLoading(false);
    }
  };

  const closeModal = () => {
    setFormData({});
    setCancelModal(false);
  };

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('ID copied to clipboard!');
    } catch {
      toast.error('Failed to copy ID.');
    }
  };

  if (load) return <Loader text="Loading ticket..." />;

  const pricePerPerson = key_value?.length ? parseInt(data?.total_rupees) / key_value.length : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Ticket Details</h1>
            <p className="text-sm text-surface-500 mt-0.5">Booking ID: {data?._id}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Favourite button */}
            <button
              onClick={isFavouriteJourney ? RemoveFromFavouriteJourney : AddToFavouriteJourney}
              disabled={FavouriteJourneyLoader}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                isFavouriteJourney
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                  : 'bg-white border-surface-200 text-surface-600 hover:border-yellow-300 hover:text-yellow-600'
              }`}
              title={isFavouriteJourney ? 'Remove from favourites' : 'Add to favourites'}
            >
              {FavouriteJourneyLoader ? (
                <ClipLoader size={14} color="currentColor" />
              ) : (
                <svg className={`w-4 h-4 ${isFavouriteJourney ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-current'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
              {isFavouriteJourney ? 'Saved' : 'Save Journey'}
            </button>
          </div>
        </div>

        {/* Journey Summary Card */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-surface-500 mb-1">Bus Name</p>
              <p className="font-semibold text-surface-900">{data?.bus_name}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Route</p>
              <p className="font-semibold text-surface-900">{data?.src} → {data?.dist}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Travel Date</p>
              <p className="font-semibold text-surface-900">{data?.date}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-green-700">₹{data?.total_rupees}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-surface-500 mb-1">Booking Date</p>
              <p className="text-sm text-surface-700">{data?.booking_date}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Distance</p>
              <p className="text-sm text-surface-700">{data?.total_distance} km</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Booking ID</p>
              <button
                onClick={() => copyId(data?._id)}
                className="text-sm text-primary-600 hover:text-primary-700 font-mono flex items-center gap-1 group"
              >
                <span className="truncate max-w-[140px]">{data?._id}</span>
                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Passengers Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100">
            <h2 className="font-semibold text-surface-900">Passengers</h2>
          </div>
          <div className="table-container border-0 shadow-none rounded-none">
            <table className="table-base">
              <thead className="table-head">
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">Name</th>
                  <th className="table-th">Seat No.</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-100">
                {key_value?.map((item, ind) => {
                  const isCompleted = new Date(data?.date) < new Date();
                  return (
                    <tr key={ind} className="table-row">
                      <td className="table-td text-surface-500">{ind + 1}</td>
                      <td className="table-td font-medium text-surface-900">{item.personName}</td>
                      <td className="table-td">
                        <span className="badge badge-blue">Seat {item.personSeat}</span>
                      </td>
                      <td className="table-td font-semibold text-surface-900">₹{pricePerPerson}</td>
                      <td className="table-td">
                        {isCompleted ? (
                          <span className="badge badge-blue">Completed</span>
                        ) : item.status ? (
                          <span className="badge badge-green">Active</span>
                        ) : (
                          <span className="badge badge-red">Cancelled</span>
                        )}
                      </td>
                      <td className="table-td">
                        {isCompleted ? (
                          <button className="btn-secondary btn-sm" disabled>Completed</button>
                        ) : item.status ? (
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => {
                              setCancelModal(true);
                              setFormData({ booking_id: data?._id, index: ind });
                            }}
                            disabled={cancelLoading}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button className="btn-secondary btn-sm" disabled>Cancelled</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <Link to="/LastTransaction" className="btn-ghost text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Bookings
          </Link>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">Cancel Ticket</h3>
                  <p className="text-xs text-surface-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-surface-600">
                Are you sure you want to cancel this ticket? The seat will be released and this action is permanent.
              </p>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-surface-100">
              <button onClick={closeModal} className="btn-secondary flex-1">Keep Ticket</button>
              <button
                onClick={cancelTicket}
                disabled={cancelLoading}
                className="btn-danger flex-1"
              >
                {cancelLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Cancelling...</>
                ) : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View_Ticket;
