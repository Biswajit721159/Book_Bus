import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loader from './Loader';
import { usermethod } from '../redux/UserSlice';

const api = process.env.REACT_APP_API;

const MasterList = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateNameError, setUpdateNameError] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [data, setData] = useState([]);
  const userInfo = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [updateId, setUpdateId] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?.user?.auth) {
      loadData();
    } else {
      navigate('/Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const loadData = () => {
    setLoading(true);
    fetch(`${api}/MasterList/${userInfo?.user?.user._id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.user?.auth}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.statusCode === 200) {
          setLoading(false);
          setData(res.data);
        } else if (res.statusCode === 498) {
          dispatch(usermethod.Logout_User());
          navigate('/Login');
        } else {
          navigate('*');
        }
      })
      .catch(() => navigate('*'));
  };

  const validateName = (s) => /^[a-zA-Z ]{2,30}$/.test(s);

  const handleSubmit = () => {
    if (!validateName(name)) {
      setNameError('Name must contain only letters, 2–30 characters, no numbers or symbols.');
      return;
    }
    setNameError('');
    setSubmitLoading(true);
    fetch(`${api}/MasterList/${userInfo?.user?.user?._id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.user?.auth}`,
      },
      body: JSON.stringify({ user_id: userInfo?.user?.user?._id, name }),
    })
      .then((r) => r.json())
      .then((res) => {
        setSubmitLoading(false);
        if (res.statusCode === 201) {
          setName('');
          setOpenAddModal(false);
          setData((prev) => [...prev, res.data]);
        } else {
          setNameError(res?.message);
        }
      })
      .catch(() => navigate('*'));
  };

  const handleDelete = (id) => {
    setDeleteLoadingId(id);
    fetch(`${api}/MasterList/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.user?.auth}`,
      },
    })
      .then((r) => r.json())
      .then(() => {
        setDeleteLoadingId(null);
        setData((prev) => prev.filter((item) => item._id !== id));
      })
      .catch(() => navigate('*'));
  };

  const handleUpdate = (id, currentName) => {
    setUpdateId(id);
    setUpdateName(currentName);
    setUpdateNameError('');
    setOpenUpdateModal(true);
  };

  const handleActualUpdate = () => {
    if (!validateName(updateName)) {
      setUpdateNameError('Name must contain only letters, 2–30 characters, no numbers or symbols.');
      return;
    }
    setUpdateNameError('');
    setUpdateLoading(true);
    fetch(`${api}/MasterList/${updateId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.user?.auth}`,
      },
      body: JSON.stringify({ name: updateName }),
    })
      .then((r) => r.json())
      .then((res) => {
        setUpdateLoading(false);
        if (res.statusCode === 200) {
          setData((prev) => prev.map((item) => (item._id === updateId ? res.data : item)));
          setOpenUpdateModal(false);
        } else {
          setUpdateNameError(res?.message);
        }
      })
      .catch(() => navigate('*'));
  };

  if (loading) return <Loader text="Loading passengers..." />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Passengers</h1>
            <p className="text-sm text-surface-500 mt-1">Manage your saved passenger list for quick booking</p>
          </div>
          <button
            onClick={() => { setName(''); setNameError(''); setOpenAddModal(true); }}
            className="btn-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Passenger
          </button>
        </div>

        {data.length > 0 ? (
          <div className="table-container">
            <table className="table-base">
              <thead className="table-head sticky top-0 z-10">
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">Name</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-100">
                {data.map((item, ind) => (
                  <tr key={ind} className="table-row">
                    <td className="table-td text-surface-500">{ind + 1}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0">
                          {item.name[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-surface-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(item._id, item.name)}
                          className="btn-secondary btn-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleteLoadingId === item._id}
                          className="btn-danger btn-sm"
                        >
                          {deleteLoadingId === item._id ? (
                            <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-surface-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-surface-800 mb-2">No passengers yet</h3>
            <p className="text-sm text-surface-500 mb-5 max-w-xs">
              Add passenger names to quickly assign them when booking tickets.
            </p>
            <button onClick={() => setOpenAddModal(true)} className="btn-primary">
              Add First Passenger
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {openAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpenAddModal(false)}>
          <div className="modal-box p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-lg font-semibold text-surface-900">Add Passenger</h2>
              <button
                onClick={() => setOpenAddModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <label className="label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                className={`input-field ${nameError ? 'input-error' : ''}`}
                placeholder="e.g. John Doe"
                autoFocus
                spellCheck={false}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {nameError && <p className="mt-1.5 text-xs text-red-600">{nameError}</p>}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-surface-100">
              <button onClick={() => setOpenAddModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={submitLoading} className="btn-primary flex-1">
                {submitLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</>
                ) : 'Add Passenger'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {openUpdateModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpenUpdateModal(false)}>
          <div className="modal-box p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-lg font-semibold text-surface-900">Edit Passenger</h2>
              <button
                onClick={() => setOpenUpdateModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <label className="label">Full Name</label>
              <input
                type="text"
                value={updateName}
                onChange={(e) => { setUpdateName(e.target.value); setUpdateNameError(''); }}
                className={`input-field ${updateNameError ? 'input-error' : ''}`}
                placeholder="e.g. John Doe"
                autoFocus
                spellCheck={false}
                onKeyDown={(e) => e.key === 'Enter' && handleActualUpdate()}
              />
              {updateNameError && <p className="mt-1.5 text-xs text-red-600">{updateNameError}</p>}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-surface-100">
              <button onClick={() => setOpenUpdateModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleActualUpdate} disabled={updateLoading} className="btn-primary flex-1">
                {updateLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterList;
