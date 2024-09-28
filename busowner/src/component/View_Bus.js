import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { getBusById } from '../utilities/busApi';
import { FullPageLoader } from './FullPageLoader';
import { toast } from 'react-toastify';
const View_Bus = () => {

    const location = useLocation();
    const [data, setData] = useState(location.state?.data || {});
    const [load, setload] = useState(false)
    const { _id } = useParams();
    const history = useNavigate();
    console.log("useParams()", _id);
    async function loadBus() {
        try {
            setload(true);
            let res = await getBusById(_id);
            setData(res.data);
        } catch (e) {
            toast.warn(e.message);
            history('*');
        } finally {
            setload(false);
        }

    }

    useEffect(() => {
        try {
            if (Object.keys(location.state?.data)?.length === 0) loadBus();
        } catch {
            loadBus();
        }
    }, [])


    return (
        <>
            {
                load === false ?
                    <div className='container'>
                        <table className="table mt-5">
                            <thead>
                                <tr>
                                    <th scope="col">Bus Name -</th>
                                    <th scope="col">{data.bus_name}</th>
                                    <th scope="col">Total No. Of Station -</th>
                                    <th scope="col">{data?.station_data?.length}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Bus ID -</th>
                                    <th><Link style={{ textDecoration: "none" }}>{data._id}</Link></th>
                                    <th>Total_seat -</th>
                                    <th>{data.Total_seat}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div className='d-flex align-items-center justify-content-center mt-5'>
                            <div>
                                {
                                    data?.station_data?.length != 0 && data?.station_data?.map((item, ind) => (
                                        <div key={ind}>
                                            <div className="mt-2">
                                                <h6>*{item.station} - {item.arrived_time} ({item.Distance_from_Previous_Station} km)</h6>
                                            </div>
                                            <div className="mx-2 d-flex align-items-center justify-content-center mt-1">
                                                {
                                                    (ind + 1) == data.station_data.length ?
                                                        ""
                                                        : <i className="fa fa-arrow-circle-down mt-2" style={{ fontSize: "25px", color: "green", textAlign: "center" }}></i>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    : <FullPageLoader open={load} />
            }
        </>
    )
}

export default View_Bus