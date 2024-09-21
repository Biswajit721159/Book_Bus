import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { FullPageLoader } from "./FullPageLoader";
import { useSelector } from "react-redux";
import { getBussByEmail, getBookingStatus } from "../utilities/busApi";
import { toast } from "react-toastify";
import { Box, Modal, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { searchData } from "../helpers/searching";

const ViewSeat = () => {

    const userinfo = useSelector((state) => state.userAuth.user);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const [data, setdata] = useState([])
    const history = useNavigate()
    const [load, setload] = useState(true)
    const [date, setdate] = useState(today)

    const [src, setsrc] = useState("");

    const [bus, setbus] = useState([]);
    const [memoBus, setMemoBus] = useState([]);
    const [openPassangerModal, setOpenPassangerModal] = useState(false);
    const [bookingData, setBookingData] = useState({});
    const [id, setId] = useState('');


    function FindError() {
        if (src === "Select Your Source Station" || src.length === 0) {
            toast.warn('Select s station');
            return false
        }
        if (date.length === 0) {
            toast.warn('Select A Date');
            return false;
        }
        return true;
    }

    async function loadBus() {
        try {
            setload(true)
            let res = await getBussByEmail();
            if (res?.data) setdata(res.data);
        } catch (e) {
            toast.warn(e.message);
            history('*');
        } finally {
            setload(false);
        }
    }

    useEffect(() => {
        if (!userinfo) {
            history('Login')
        }
        else {
            loadBus();
        }
    }, [])

    const minDate = () => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    };

    function findBusId() {
        for (let i = 0; i < data.length; i++) {
            if (data[i].bus_name === src) {
                return data[i]._id
            }
        }
        return null
    }

    async function findbus() {
        try {
            if (FindError()) {
                setload(true);
                let id = findBusId()
                let res = await getBookingStatus(date, id);
                if (res.data) {
                    setbus(res.data);
                    setMemoBus(res.data);
                }
            }
        }
        catch (e) {
            toast.warn(e.message);
        }
        finally {
            setload(false);
        }
    }

    useEffect(() => {
        let filterData = searchData(bus, id, '_id');
        setMemoBus([...filterData])
    }, [id])

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
        border: '2px solid green',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };
    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); findbus() }}>

                <div className="d-flex align-items-center justify-content-center mt-5">
                    <div className="d-flex ">
                        <select className="form-select" aria-label="Default select example" required onChange={(e) => { setsrc(e.target.value) }} style={{ backgroundColor: "white" }}>
                            <option style={{ textAlign: "center" }} selected>Select your source station</option>
                            {
                                data?.map((item, ind) => (
                                    <option key={ind} style={{ textAlign: "center" }} >{item.bus_name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="d-flex mx-2">
                        <div className="input-group date" id="datepicker">
                            <input type="date" className="form-control" value={date} onChange={(e) => { setdate(e.target.value) }} required id="date" />
                        </div>
                    </div>
                    <div className="d-flex d-flex justify-content-center mx-1">
                        <button
                            type="submit"
                            className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white"
                            disabled={load}
                        >
                            {load ? 'Wait Finding...' : 'Find Bus'}
                        </button>
                    </div>
                </div>

            </form>
            <div className="container mt-0 p-5 my-5">
                <div className="flex justify-end items-center">
                    <input
                        className="mt-4 mb-2 ml-3 mr-3 px-3 py-2 border rounded placeholder-gray-500 outline-blue-400 "
                        placeholder="Enter Id number"
                        value={id}
                        onChange={(e) => { setId(e.target.value) }}
                        spellCheck='false'
                    />

                    {id.length ?
                        <CloseIcon
                            fontSize="small"
                            className={`absolute mr-5 mt-3 w-0.5 h-0.5 text-sm cursor-pointer hover:bg-gray-200 rounded-lg`}
                            onClick={() => setId('')}
                        />
                        : ''}
                </div>
                {
                    memoBus.length != 0 ?
                        <table className="table border">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">ID No</th>
                                    <th className="text-center" scope="col">Src</th>
                                    <th className="text-center" scope="col">Dist</th>
                                    <th className="text-center" scope="col">Pay</th>
                                    <th className="text-center" scope="col">Total Distance</th>
                                    <th className="text-center" scope="col">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    memoBus.map((item, ind) => (
                                        <tr>
                                            <td className="text-center">{item._id}</td>
                                            <td className="text-center">{item.src}</td>
                                            <td className="text-center">{item.dist}</td>
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
                                                    view
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        : <p className="d-flex align-items-center justify-content-center mt-5">Result not found 😥</p>
                }
            </div>
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
                            </li>
                        ))}
                    </ul>

                    <Box textAlign="center" mt={2}>
                        <button
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white"
                            style={{ textTransform: 'none' }}
                            onClick={handleClose}
                        >
                            Close
                        </button>
                    </Box>
                </Box>
            </Modal>
            <FullPageLoader open={load} />
        </>
    )
}

export default ViewSeat