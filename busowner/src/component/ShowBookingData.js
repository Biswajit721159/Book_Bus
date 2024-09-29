import React, { useState } from "react";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Modal, Typography, IconButton } from "@mui/material";
import { convertUtcToIst } from "../helpers/USTtoIST";
import NorthEastOutlinedIcon from '@mui/icons-material/NorthEastOutlined';
import { useNavigate } from "react-router-dom";

const ShowBookingData = ({ data }) => {
    const [bookingData, setBookingData] = useState({});
    const [openPassengerModal, setOpenPassengerModal] = useState(false);
    const history = useNavigate();

    const handleClose = () => {
        setOpenPassengerModal(false);
        setBookingData({});
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid #3b82f6', // blue color border
        boxShadow: 24,
        p: 2,
        borderRadius: '10px', // smooth border radius
    };

    return (
        <>
            {data?.length !== 0 ? (
                <div className="overflow-auto rounded-lg shadow-lg">
                    <table className="table-auto w-full bg-white text-sm text-left border-collapse">
                        <thead className="bg-blue-600 text-white uppercase">
                            <tr>
                                <th className="py-2 px-4 text-center">ID No / Email</th>
                                <th className="py-2 px-4 text-center">Created At / Updated At</th>
                                <th className="py-2 px-4 text-center">Bus Name</th>
                                <th className="py-2 px-4 text-center">Src - Dist</th>
                                <th className="py-2 px-4 text-center">Journey Date</th>
                                <th className="py-2 px-4 text-center">Payment</th>
                                <th className="py-2 px-4 text-center">Distance</th>
                                <th className="py-2 px-4 text-center">Passengers Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-800">{item._id}</p>
                                            <p className="text-blue-500">{item.useremail}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex flex-col">
                                            <p><strong>Create:</strong> {convertUtcToIst(item.createdAt)}</p>
                                            <p><strong>Last Update:</strong> {convertUtcToIst(item.updatedAt)}</p>
                                        </div>
                                    </td>
                                    <td
                                        className="py-3 px-4 text-center cursor-pointer text-blue-600 hover:underline flex items-center justify-center"
                                        onClick={() => history(`/View_Bus/${item?.bus_id}`)}
                                    >
                                        {item?.bus?.bus_name}
                                        <NorthEastOutlinedIcon className="ml-1" fontSize="small" />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div>
                                            <p>{item.src}</p>
                                            <KeyboardDoubleArrowDownIcon className="text-blue-700" fontSize="small" />
                                            <p>{item.dist}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">{convertUtcToIst(item.date)}</td>
                                    <td className="py-3 px-4 text-center">₹{item.total_money}</td>
                                    <td className="py-3 px-4 text-center">{item.total_distance} km</td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
                                            onClick={() => {
                                                setOpenPassengerModal(true);
                                                setBookingData(item);
                                            }}
                                        >
                                            View Seats
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Modal
                        open={openPassengerModal}
                        onClose={handleClose}
                        aria-labelledby="modal-title"
                    >
                        <Box sx={style}>
                            <IconButton
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Typography variant="h6" className="text-center mb-3">
                                Seats and Passengers
                            </Typography>

                            <ul className="space-y-2">
                                {bookingData?.seat_record?.map((seat, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm"
                                    >
                                        <span className="font-medium">Seat {seat}</span>
                                        <span>{bookingData?.person?.[index]}</span>
                                        <span>
                                            {bookingData?.status?.[index] ? (
                                                <p className="px-2 py-1 bg-green-500 text-white rounded-md text-xs">
                                                    Booked
                                                </p>
                                            ) : (
                                                <p className="px-2 py-1 bg-red-500 text-white rounded-md text-xs">
                                                    Cancelled
                                                </p>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    </Modal>
                </div>
            ) : (
                <p className="flex items-center justify-center mt-5 text-gray-500">No results found 😥</p>
            )}
        </>
    );
};

export default ShowBookingData;
