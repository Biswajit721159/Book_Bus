import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Loader from './Loader'
import Swal from 'sweetalert2'
import { HiOutlineCheckCircle } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { loadStation, loadBus, fetchBusData } from '../redux/BusSlice'
import Searching from "./Searching";
const api = process.env.REACT_APP_API
const Home = () => {

    let date = useSelector((state) => state.BusSearch.date)
    const history = useNavigate()
    let src = useSelector((state) => state.BusSearch.src);
    let dist = useSelector((state) => state.BusSearch.dist);
    const [bus__id, setbus__id] = useState('')
    const [show_seat_button, setshow_seat_button] = useState("Show Seat")
    const [disabled_showseat, setdisabled_showseat] = useState(false)
    const [Available_seat, setAvailable_seat] = useState(0)
    const [seat_res_come, setseat_res_come] = useState(false)

    const dispatch = useDispatch();
    const { Bus, station, loadingBus, loadingStation, error } = useSelector(state => state.Bus);

    const [bus, setbus] = useState(Bus)

    useEffect(() => {
        if (Bus?.length === 0 && src?.length !== 0 && dist?.length !== 0) dispatch(fetchBusData({ src, dist }))
        else if (Bus?.length === 0) dispatch(loadBus());
        if (station?.length === 0) dispatch(loadStation());
    }, [dispatch]);

    function show_seat(_id, src, dist) {
        if (date.length < 10) {
            Swal.fire("Please Select a Date!")
            return;
        }
        setbus__id(_id)
        setseat_res_come(false)
        setdisabled_showseat(true)
        setshow_seat_button("Loading....")
        fetch(`${api}/Booking/get_Seat`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_station: src,
                end_station: dist,
                date: date,
                bus_id: _id,
            })
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode == 200) {
                setAvailable_seat(res.data.nowAvailable_seat)
                setdisabled_showseat(false)
                setshow_seat_button("Show Seat")
                setseat_res_come(true)
            }
        }, (error) => {
            history('*')
        })
    }

    const [DurationEarlyFirst, setDurationEarlyFirst] = useState(false)
    const [DurationLateFirst, setDurationLateFirst] = useState(false)
    const [DepartureEarlyFirst, setDepartureEarlyFirst] = useState(false)
    const [DepartureLateFirst, setDepartureLateFirst] = useState(false)
    const [ArrivalEarlyFirst, setArrivalEarlyFirst] = useState(false)
    const [ArrivalLateFirst, setArrivalLateFirst] = useState(false)


    function removedRemainingChecked(s) {
        if (s !== "DurationEarlyFirst")
            setDurationEarlyFirst(false)
        if (s !== "DurationLateFirst")
            setDurationLateFirst(false)
        if (s !== "DepartureEarlyFirst")
            setDepartureEarlyFirst(false)
        if (s !== "DepartureLateFirst")
            setDepartureLateFirst(false)
        if (s !== "ArrivalEarlyFirst")
            setArrivalEarlyFirst(false)
        if (s !== "ArrivalLateFirst")
            setArrivalLateFirst(false)

    }

    function ChangeChecked(e, s) {
        if (s === "DurationEarlyFirst") {
            setDurationEarlyFirst(e.target.checked)
            removedRemainingChecked(s)
        }
        else if (s === "DurationLateFirst") {
            setDurationLateFirst(e.target.checked)
            removedRemainingChecked(s)
        }
        else if (s === "DepartureEarlyFirst") {
            setDepartureEarlyFirst(e.target.checked)
            removedRemainingChecked(s)
        }
        else if (s === "DepartureLateFirst") {
            setDepartureLateFirst(e.target.checked)
            removedRemainingChecked(s)
        }
        else if (s === "ArrivalEarlyFirst") {
            setArrivalEarlyFirst(e.target.checked)
            removedRemainingChecked(s)
        }
        else if (s === "ArrivalLateFirst") {
            setArrivalLateFirst(e.target.checked)
            removedRemainingChecked(s)
        }
    }

    function HourToMin(s) {
        let count = 0;
        let ans = 0;
        let i = 0;
        let n = s.length
        while (i < n && s[i] != 'h') {
            count = count * 10 + (s[i] - '0');
            i++;
        }
        ans += (count * 60);
        i += 2;
        count = 0;
        while (i < n && s[i] != 'm') {
            count = count * 10 + (s[i] - '0');
            i++;
        }
        ans += count;
        return ans;
    }

    function finMinutes(s) {
        let hh = s.substr(0, 2);
        let mm = s.substr(3, 2);

        hh = parseInt(hh);
        mm = parseInt(mm);
        return (hh * 60 + mm)
    }

    function applyFilter() {
        if (DurationEarlyFirst) {
            bus.sort((a, b) => {
                let fa = HourToMin(a.total_time)
                let fb = HourToMin(b.total_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            setbus([...bus])
        }
        else if (DurationLateFirst) {
            bus.sort((a, b) => {
                let fa = HourToMin(a.total_time)
                let fb = HourToMin(b.total_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            setbus([...bus])
        }
        else if (DepartureEarlyFirst) {
            bus.sort((a, b) => {
                let fa = finMinutes(a.end_arrive_time)
                let fb = finMinutes(b.end_arrive_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            setbus([...bus])
        }
        else if (DepartureLateFirst) {
            bus.sort((a, b) => {
                let fa = finMinutes(a.end_arrive_time)
                let fb = finMinutes(b.end_arrive_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            setbus([...bus])
        }
        else if (ArrivalEarlyFirst) {
            bus.sort((a, b) => {
                let fa = finMinutes(a.start_arrived_time)
                let fb = finMinutes(b.start_arrived_time)

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            setbus([...bus])
        }
        else if (ArrivalLateFirst) {
            bus.sort((a, b) => {
                let fa = finMinutes(a.start_arrived_time)
                let fb = finMinutes(b.start_arrived_time)

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
            setbus([...bus])
        }
        else {
            loadStation()
        }
    }
    return (
        <>
            {
                loadingBus === true || loadingStation === true ?
                    <Loader /> :
                    <>
                        <Searching />

                        <div className="container-fluid">
                            {/* <div className="mt-5" style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                                <div className="mb-3 mx-2">
                                    <div className="form-check">
                                        <input className="form-check-input" checked={DurationEarlyFirst} onChange={(e) => ChangeChecked(e, "DurationEarlyFirst")} type="checkbox" />
                                        <label className="form-check-label">
                                            Duration(Early First)
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 mx-2">
                                    <div className="form-check">
                                        <input className="form-check-input" checked={DurationLateFirst} onChange={(e) => ChangeChecked(e, "DurationLateFirst")} type="checkbox" />
                                        <label className="form-check-label">
                                            Duration(Late First)
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 mx-2">
                                    <div className="form-check">
                                        <input className="form-check-input" checked={DepartureEarlyFirst} onChange={(e) => ChangeChecked(e, "DepartureEarlyFirst")} type="checkbox" />
                                        <label className="form-check-label">
                                            Departure(Early First)
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 mx-2">
                                    <div className="form-check">
                                        <input className="form-check-input" checked={DepartureLateFirst} onChange={(e) => ChangeChecked(e, "DepartureLateFirst")} type="checkbox" />
                                        <label className="form-check-label">
                                            Departure(Late First)
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 mx-2">
                                    <div className="form-check">
                                        <input className="form-check-input" checked={ArrivalEarlyFirst} onChange={(e) => ChangeChecked(e, "ArrivalEarlyFirst")} type="checkbox" />
                                        <label className="form-check-label">
                                            Arrival(Early First)
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 mx-2">
                                    <div className="form-check">
                                        <input className="form-check-input" checked={ArrivalLateFirst} onChange={(e) => ChangeChecked(e, "ArrivalLateFirst")} type="checkbox" />
                                        <label className="form-check-label">
                                            Arrival(Late First)
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-success btn-sm" onClick={applyFilter}>Apply Filter</button>
                            </div> */}


                            {Bus?.length != 0 ? <div className="row d-flex justify-content-around">
                                <div className="col-9 mt-5">
                                    <table className=" container table table-striped table border-info">
                                        <thead>
                                            <tr>
                                                <th className="text-center" scope="col">Bus Name</th>
                                                <th className="text-center" scope="col">Starting Station</th>
                                                <th className="text-center" scope="col">Arrived Time</th>
                                                <th className="text-center" scope="col">Distance</th>
                                                <th className="text-center" scope="col">Rupees</th>
                                                <th className="text-center" scope="col">Departure Time</th>
                                                <th className="text-center" scope="col">Duration</th>
                                                <th className="text-center" scope="col">Ending Station</th>
                                                <th className="text-center" scope="col">View Bus</th>
                                                <th className="text-center" scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                Bus?.length != 0 ?
                                                    Bus?.map((item, ind) => (
                                                        <tr key={ind} style={{ height: "70px", margin: '20px' }}>
                                                            <td className="text-center">{item.bus_name} <HiOutlineCheckCircle style={{ color: 'green' }} /></td>
                                                            <td className="text-center">{item.start_station}</td>
                                                            <td className="text-center"> {item.start_arrived_time}</td>
                                                            <td className="text-center">{item.total_distance}</td>
                                                            <td className="text-center">₹{item.total_distance * 5}</td>
                                                            <td className="text-center">{item.end_arrive_time}</td>
                                                            <td className="text-center">{item.total_time}</td>
                                                            <td className="text-center">{item.end_station}</td>
                                                            <td className="text-center"><Link to={`/View_Bus/${item.bus_id}`}><button className="btn btn-primary btn-sm">view</button></Link></td>
                                                            {
                                                                item.bus_id != bus__id ?
                                                                    <td className="text-center"><button className="btn btn-info btn-sm" onClick={() => { show_seat(item.bus_id, item.start_station, item.end_station) }} >Show</button></td>
                                                                    :
                                                                    seat_res_come == true ?
                                                                        <td className="text-center">
                                                                            <button className="btn btn-primary btn-sm" disabled={true} >{Available_seat} Left </button>
                                                                            <Link to={`/${item.bus_id}/${item.start_station}/${item.end_station}/${date}`}>
                                                                                <button className="btn btn-primary btn-sm">
                                                                                    Book
                                                                                </button>
                                                                            </Link>
                                                                        </td>
                                                                        :
                                                                        <td className="text-center">
                                                                            <button className="btn btn-danger btn-sm" disabled={disabled_showseat} onClick={() => { show_seat(item.bus_id, item.start_station, item.end_station) }} >
                                                                                {show_seat_button}
                                                                            </button>
                                                                        </td>
                                                            }
                                                        </tr>
                                                    ))
                                                    : <tr >
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center"></td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div> : <h6 className="text-center mt-5">Bus not Found ! 😥 </h6>
                            }
                        </div>
                    </>
            }
        </>
    )
}
export default Home