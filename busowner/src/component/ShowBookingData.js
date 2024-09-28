import React, { useState } from "react";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Modal, Typography, IconButton } from "@mui/material";
import { convertUtcToIst } from "../helpers/USTtoIST";
import NorthEastOutlinedIcon from '@mui/icons-material/NorthEastOutlined';
import { useNavigate } from "react-router-dom";

const ShowBookingData = ({ data }) => {
    const [bookingData, setBookingData] = useState({});
    const [openPassangerModal, setOpenPassangerModal] = useState(false);
    const history = useNavigate();
    const handleClose = () => {
        setOpenPassangerModal(false);
        setBookingData({});
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        border: '1px solid blue',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };
    return (
        <>
            {
                data?.length != 0 ?
                    <div className="overflow-scroll">
                        <table className="table border bg-slate-50">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">id no/email</th>
                                    <th className="text-center" scope="col">createdAt-updatedAt</th>
                                    <th className="text-center" scope="col">bus name</th>
                                    <th className="text-center" scope="col">src-dist</th>
                                    <th className="text-center" scope="col">booking date</th>
                                    <th className="text-center" scope="col">pay</th>
                                    <th className="text-center" scope="col">total distance</th>
                                    <th className="text-center" scope="col">passengers detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, ind) => (
                                        <tr>
                                            <td className="text-center">
                                                <div className="flex flex-col justify-center gap-1 rounded-lg">
                                                    <p className="text-black">{item._id}</p>
                                                    <p className="text-blue-500">{item.useremail}</p>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex flex-col">
                                                    <p><strong>create-</strong>{convertUtcToIst(item.createdAt)}</p>
                                                    <p><strong>last update-</strong>{convertUtcToIst(item.updatedAt)}</p>
                                                </div>
                                            </td>
                                            <td
                                                className="text-center cursor-pointer"
                                                onClick={() => {
                                                    history(`/View_Bus/${item?.bus_id}`)
                                                }}
                                            >
                                                {item?.bus?.bus_name}<NorthEastOutlinedIcon className="text-blue-700" fontSize="small" />
                                            </td>
                                            <td className="text-center">
                                                <div>
                                                    <p>{item.src}</p>
                                                    <KeyboardDoubleArrowDownIcon className="text-blue-700" fontSize="small" />
                                                    <p>{item.dist}</p>
                                                </div>
                                            </td>
                                            <td className="text-center">{convertUtcToIst(item.date)}</td>
                                            <td className="text-center">₹{item.total_money}</td>
                                            <td className="text-center">{item.total_distance} km</td>
                                            <td className="text-center">
                                                <button
                                                    className="p-2 bg-orange-500 hover:bg-orange-600 rounded-md text-sm text-white"
                                                    onClick={() => {
                                                        setOpenPassangerModal(true);
                                                        setBookingData(item);
                                                    }}
                                                >
                                                    view seat
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <Modal
                            open={openPassangerModal}
                            onClose={handleClose}
                            aria-labelledby="modal-title"
                        >
                            <Box
                                sx={style}
                            >
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

                                <Typography variant="body1" className="text-center mb-3">
                                    <strong>Seats and Passengers</strong>
                                </Typography>
                                <ul>
                                    {bookingData?.seat_record?.map((seat, index) => (
                                        <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                            <span>Seat {seat}</span>
                                            <span>{bookingData?.person?.[index]}</span>
                                            <span>
                                                {
                                                    bookingData?.status?.[index] === true ?
                                                        <p className="p-1 rounded-md text-sm text-gray-100 bg-green-500">Booked</p> :
                                                        <p className="p-1 m-1 rounded-md text-sm text-gray-100 bg-red-500">Cancel</p>
                                                }
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </Modal>
                    </div>
                    : <p className="d-flex align-items-center justify-content-center mt-5">Result not found 😥</p>
            }
        </>
    )
}

export default ShowBookingData;