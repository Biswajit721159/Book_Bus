import React from "react";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { convertUtcToIst } from "../helpers/USTtoIST";

const ShowBookingData = ({ data }) => {
    return (
        <>
            {
                data?.length != 0 ?
                    <div className="overflow-scroll">
                        <table className="table border bg-slate-100">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">id no</th>
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
                                                <div className="flex flex-col text-sky-700">
                                                    <p><strong>create-</strong>{convertUtcToIst(item.createdAt)}</p>
                                                    <p><strong>last update-</strong>{convertUtcToIst(item.updatedAt)}</p>
                                                </div>
                                            </td>
                                            <td className="text-center">{item?.bus?.bus_name || '-'}</td>
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
                                                // onClick={() => {
                                                //     setOpenPassangerModal(true);
                                                //     setBookingData(item);
                                                // }}
                                                >
                                                    view seat
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    : <p className="d-flex align-items-center justify-content-center mt-5">Result not found 😥</p>
            }
        </>
    )
}

export default ShowBookingData;