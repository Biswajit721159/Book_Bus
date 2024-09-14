import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddBus } from "../utilities/busApi";
import { toast } from "react-toastify";
import { FullPageLoader } from "./FullPageLoader";

const Bus_adder = () => {
    const userinfo = JSON.parse(localStorage.getItem('user'));
    const history = useNavigate();

    useEffect(() => {
        if (userinfo == null) {
            history('/Login');
        }
    }, [userinfo, history]);

    const [name, setname] = useState("");
    const [messname, setmessname] = useState("");
    const [wrongname, setwrongname] = useState(false);

    const [station, setstation] = useState("");
    const [messstation, setmessstation] = useState("");
    const [wrongstation, setwrongstation] = useState(false);

    const [arrived_time, setarrived_time] = useState("");
    const [messarrived_time, setmessarrived_time] = useState("");
    const [wrongarrived_time, setwrongarrived_time] = useState(false);

    const [seat, setseat] = useState("");
    const [messseat, setmessseat] = useState("");
    const [wrongseat, setwrongseat] = useState(false);

    const [Distance, setDistance] = useState("");
    const [messDistance, setmessDistance] = useState("");
    const [wrongDistance, setwrongDistance] = useState(false);

    const [button, setbutton] = useState("Final Submit");
    const [disabled, setdisabled] = useState(false);

    const [islast_station, setislast_station] = useState(false);
    const [show_html, setshow_shtml] = useState(false);

    const [data, setdata] = useState([]);
    const [load, setLoad] = useState(false);

    function add_into_list() {
        setshow_shtml(islast_station);
        setdata([...data, {
            station: station,
            arrived_time: arrived_time,
            Distance_from_Previous_Station: Distance
        }]);
        setstation("");
        setarrived_time("");
        setDistance("");
    }

    async function submit() {
        try {
            setLoad(true);
            let res = await AddBus(name, seat, data);
        } catch (e) {
            toast.warn(e.message);
        } finally {
            setLoad(false);
        }
    }

    function Delete_station(ind) {
        const updatedData = [...data];
        updatedData.splice(ind, 1);
        setdata(updatedData);
    }

    return (
        <div className="container mx-auto p-6">
            {data.length === 0 && (
                <div className="flex flex-col mt-6 items-center">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        className="w-full max-w-md p-3 mb-4 border rounded-lg"
                        placeholder="Enter Bus Name"
                        required
                    />
                    {wrongname && <p className="text-red-500 mt-1">{messname}</p>}
                    <input
                        type="number"
                        value={seat}
                        onChange={(e) => setseat(e.target.value)}
                        className="w-full max-w-md p-3 border rounded-lg"
                        placeholder="Enter Total Seat"
                        required
                    />
                    {wrongseat && <p className="text-red-500 mt-1">{messseat}</p>}
                </div>
            )}

            {data.length > 0 && (
                <table className="w-full mt-6 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-center">Bus Name</th>
                            <th className="border border-gray-300 p-2 text-center">{name}</th>
                            <th className="border border-gray-300 p-2 text-center">Total Seat</th>
                            <th className="border border-gray-300 p-2 text-center">{seat}</th>
                        </tr>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-center">Station No.</th>
                            <th className="border border-gray-300 p-2 text-center">Station Name</th>
                            <th className="border border-gray-300 p-2 text-center">Arrived Time</th>
                            <th className="border border-gray-300 p-2 text-center">Distance From Previous Station</th>
                            <th className="border border-gray-300 p-2 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, ind) => (
                            <tr key={ind} className="text-center">
                                <td className="border border-gray-300 p-2">{ind + 1}</td>
                                <td className="border border-gray-300 p-2">{item.station}</td>
                                <td className="border border-gray-300 p-2">{item.arrived_time}</td>
                                <td className="border border-gray-300 p-2">{item.Distance_from_Previous_Station}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        onClick={() => Delete_station(ind)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!show_html && (
                <div className="flex flex-col mt-6 items-center">
                    <input
                        type="text"
                        value={station}
                        onChange={(e) => setstation(e.target.value.toUpperCase())}
                        className="w-full max-w-md p-3 mb-4 border rounded-lg"
                        placeholder="Enter Station Name"
                        required
                    />
                    <label className="text-green-500 mb-2">*Enter Arrived Time (24 Hour Format)</label>
                    <input
                        type="time"
                        value={arrived_time}
                        onChange={(e) => setarrived_time(e.target.value)}
                        className="w-full max-w-md p-3 mb-4 border rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        value={Distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-full max-w-md p-3 mb-4 border rounded-lg"
                        placeholder="Distance from Previous Station"
                        required
                    />
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                onChange={(e) => setislast_station(e.target.checked)}
                            />
                            <span className="ml-2">Is this the Last Station?</span>
                        </label>
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={add_into_list}
                    >
                        Add Into Your List
                    </button>
                </div>
            )}

            {show_html && (
                <div className="text-center mt-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                        disabled={disabled}
                        onClick={submit}
                    >
                        {button}
                    </button>
                </div>
            )}
            <FullPageLoader open={load} />
        </div>
    );
};

export default Bus_adder;
