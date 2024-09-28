import { useState } from 'react';
import { convertUtcToIst } from '../helpers/USTtoIST';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal, Button, Box } from '@mui/material';

const ShowDataIntoTable = ({ data }) => {
    const history = useNavigate();
    const otherUserinfo = useSelector((state) => state.userAuth.otherUserinfo);
    const [isDeleted, setIsDeleted] = useState(false);
    let deletedId = '';
    const handleDelete = () => {
        setIsDeleted(false);
    }
    const handleClose = () => {
        setIsDeleted(false);
    }
    return (
        <>
            <table className="container table mt-5">
                <thead>
                    <tr>
                        <th className='text-center text-gray-500' scope="col">#</th>
                        <th className='text-center text-gray-500' scope="col">Bus Name</th>
                        <th className='text-center text-gray-500' scope="col">Total Seat</th>
                        <th className='text-center text-gray-500' scope="col">Src To Dist</th>
                        <th className='text-center text-gray-500' scope="col">Create At</th>
                        {otherUserinfo?.role === "200" ? <th className='text-center text-gray-500' scope="col">Action Taken</th> : ''}
                        <th className='text-center text-gray-500' >view</th>
                        <th className='text-center text-gray-500' >edit</th>
                        <th className='text-center text-gray-500' >delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length ?
                        data?.map((item, ind) => (
                            <tr key={ind}>
                                <th className='text-center' scope="row">{ind + 1}</th>
                                <td className='text-center'>{item?.bus_name}</td>
                                <td className='text-center' >{item?.Total_seat}</td>
                                <th className='text-center'>*{item?.station_data[0]?.station} - {item?.station_data[(item?.station_data?.length) - 1]?.station}</th>
                                <td className='text-center' >{convertUtcToIst(item?.createdAt)}</td>
                                {otherUserinfo?.role === "200" ? <td className='text-center' >
                                    <button className={`px-3 p-1.5 bg-${item?.status === "pending" ? 'blue' : (item?.status === "approved" ? 'green' : 'red')}-500 rounded-md text-white text-sm`}
                                        onClick={() => history('/EditBus', { state: { data: item, type: 'edit' } })}
                                    >
                                        {item?.status}
                                    </button>
                                </td> : ''}
                                <td className='text-center' >
                                    <button
                                        className='px-3 p-1.5 bg-orange-500 rounded-md hover:bg-orange-600 text-white text-sm'
                                        onClick={() => history(`/View_Bus/${item?._id}`, { state: { data: item, type: 'View_Bus' } })}
                                    >
                                        View
                                    </button>
                                </td>
                                <td className='text-center'>
                                    <button
                                        className='px-3 p-1.5 bg-sky-500 rounded-md hover:bg-sky-600 text-white text-sm'
                                        onClick={() => history('/EditBus', { state: { data: item, type: 'edit' } })}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td className='text-center'>
                                    <button
                                        className='px-3 p-1.5 bg-red-500 rounded-md hover:bg-red-600 text-white text-sm'
                                        onClick={
                                            () => {
                                                setIsDeleted(true);
                                                deletedId = item?._id;;
                                            }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                        : <tr>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            {otherUserinfo.role === "200" ? <td className='text-center'>-</td> : ''}
                        </tr>
                    }
                </tbody>
            </table >
            <Modal
                open={isDeleted}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto my-20 text-center">
                    <h2 className="text-xl font-semibold mb-4">Confirm Bus Deletion</h2>
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this bus? This action cannot be undone.</p>
                    <div className="flex justify-evenly">
                        <button
                            variant="outlined"
                            onClick={handleClose}
                            className="p-2 rounded-md bg-gray-500 text-white border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            variant="contained"
                            color="error"
                            className="p-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default ShowDataIntoTable;