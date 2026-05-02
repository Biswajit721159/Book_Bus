import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { usermethod } from '../redux/UserSlice';
import { ClipLoader } from 'react-spinners';

const api = process.env.REACT_APP_API;

const LastTransaction = () => {
  const userinfo = useSelector((state) => state.user);
  const history = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [wishlistLoader, setWishlistLoader] = useState(false);
  const [wishListId, setWishListId] = useState();
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadTicket = (page = 1) => {
    setLoad(true);
    fetch(`${api}/Booking/getTicket/${userinfo?.user?.user?.email}/${page}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo?.user?.auth}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.statusCode === 200) {
          setLoad(false);
          setData(res.data?.bookingData);
          setTotalPage(res.data?.totalPage);
        } else if (res.statusCode === 498) {
          dispatch(usermethod.Logout_User());
          history('/Login');
        } else {
          history('*');
        }
      })
      .catch(() => history('*'));
  };

  useEffect(() => {
    if (!userinfo?.user?.auth) {
      history('/Login');
    } else {
      loadTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToWishList = async (id, is_wishlist) => {
    if (wishlistLoader) return;
    setWishlistLoader(true);
    setWishListId(id);
    const response = await fetch(`${api}/Booking/addAndRemoveFromWishList`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo?.user?.auth}`,
      },
      body: JSON.stringify({ id, is_wishlist: is_wishlist ? 'no' : 'yes' }),
    });
    const booking = await response.json();
    const updated = booking?.data;
    setData((prev) => prev.map((item) => (item._id === updated?._id ? updated : item)));
    setWishlistLoader(false);
  };

  const changePage = (page) => {
    setCurrentPage(page);
    loadTicket(page);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900">My Bookings</h1>
          <p className="text-sm text-surface-500 mt-1">View and manage all your bus bookings</p>
        </div>

        {load ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-sm text-surface-500">Loading bookings...</p>
            </div>
          </div>
        ) : data?.length ? (
          <>
            <div className="table-container">
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <table className="table-base">
                  <thead className="table-head sticky top-0 z-10">
                    <tr>
                      <th className="table-th">#</th>
                      <th className="table-th">Route</th>
                      <th className="table-th">Travel Date</th>
                      <th className="table-th">Amount</th>
                      <th className="table-th">Wishlist</th>
                      <th className="table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-surface-100">
                    {data.map((item, ind) => (
                      <tr key={ind} className="table-row">
                        <td className="table-td text-surface-500 font-medium">
                          {(currentPage - 1) * 10 + ind + 1}
                        </td>
                        <td className="table-td">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm font-medium text-surface-800">{item.src}</span>
                            </div>
                            <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-400" />
                              <span className="text-sm font-medium text-surface-800">{item.dist}</span>
                            </div>
                          </div>
                        </td>
                        <td className="table-td">
                          <span className="text-sm text-surface-700">{item.date}</span>
                        </td>
                        <td className="table-td">
                          <span className="text-sm font-bold text-green-700">₹{item.total_money}</span>
                        </td>
                        <td className="table-td">
                          {wishlistLoader && wishListId === item._id ? (
                            <ClipLoader size={16} color="#2563eb" />
                          ) : (
                            <button
                              onClick={() => addToWishList(item._id, item.is_wishlist)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                                item.is_wishlist
                                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                  : 'bg-surface-100 text-surface-400 hover:bg-red-50 hover:text-red-400'
                              }`}
                              title={item.is_wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <svg
                                className="w-4 h-4"
                                fill={item.is_wishlist ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          )}
                        </td>
                        <td className="table-td">
                          <Link to={`/${item._id}`}>
                            <button className="btn-primary btn-sm">
                              View Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary btn-sm px-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
                      currentPage === page
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => changePage(Math.min(totalPage, currentPage + 1))}
                  disabled={currentPage === totalPage}
                  className="btn-secondary btn-sm px-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-800 mb-2">No bookings yet</h3>
            <p className="text-surface-500 text-sm mb-6 max-w-sm">
              You haven't made any bookings yet. Start by searching for a bus route.
            </p>
            <Link to="/BookBus" className="btn-primary">
              Book a Bus
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastTransaction;
