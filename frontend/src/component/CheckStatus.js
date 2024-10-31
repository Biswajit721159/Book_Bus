import React, { useState } from 'react'
import '../stylesheet/CheckStatus.css'
import ShowPreviousHistory from './ShowPreviousHistory';
import { toast } from 'react-toastify';
const api = process.env.REACT_APP_API

const CheckStatus = () => {
    const [idNumber, setidNumber] = useState('');
    const [data, setdata] = useState();
    const [key_value, setkey_value] = useState([]);
    const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);
    const [loading, setLoading] = useState(false);

    function submit() {
        if (!idNumber) return;
        setLoading(true);
        fetch(`${api}/Booking/getTicketForUnAuthUser/${idNumber}`).then(responce => responce.json()).then((res) => {
            if (res != undefined && res?.statusCode === 200) {
                setdata(res?.data);
                setkey_value(res?.data?.seat_record);
                toast.success('Ticket Successfully Found');
                addRemoveSearchHistory(idNumber);
            }
            else {
                toast.warn('Invalid value');
            }
            setLoading(false);
        }, (error) => {
            toast.warn('Invalid value');
            setLoading(false);
        })
    }

    const addRemoveSearchHistory = (idNumber) => {
        let newSearchHistory = searchHistory?.filter((el) => {
            return el !== idNumber;
        });
        newSearchHistory.unshift(idNumber);
        setSearchHistory(newSearchHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
    };

    const deletePreviousHistory = (Id) => {
        const newSearchHistory = searchHistory && searchHistory?.filter((el) => {
            return el !== Id;
        })
        setSearchHistory(newSearchHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
    }

    const onClickSearchHistory = (Id) => {
        setidNumber(Id);
    }

    return (
        <>
            <div className='checkstatus mt-3'>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'row' }}>
                    <input type="text"
                        onChange={(e) => { setidNumber(e.target.value) }}
                        value={idNumber}
                        spellCheck='false'
                        className="checkinputfrom"
                        placeholder="Enter Id Number"
                        required
                    />
                    <button
                        className="btn btn-primary mx-1"
                        id='checkbtn'
                        onClick={submit}
                        disabled={loading}>
                        {!loading ? "check status" : 'please wait..'}
                    </button>
                </div>
            </div>

            <ShowPreviousHistory
                searchHistory={searchHistory}
                deletePreviousHistory={deletePreviousHistory}
                onClickSearchHistory={onClickSearchHistory}
            />

            {
                data ?
                    <div className='container shadow mt-5'>
                        < table className="table" >
                            <thead>
                                <tr>
                                    <th scope="col">Bus Name : {data?.bus_name}</th>
                                    <th scope="col">Booking Date : {data?.booking_date}</th>
                                    <th scope="col">Total Distance : {data?.total_distance} km</th>
                                    <th scope="col">{data?.src}  -  {data?.dist}</th>
                                </tr>
                            </thead>
                            <thead >
                                <tr className='mt-5'>
                                    <th scope="col">SL No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Seat No.</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    key_value?.map((item, ind) => (
                                        <tr key={ind}>
                                            <th scope="row">{ind + 1}</th>
                                            <td>passanger {ind + 1}</td>
                                            <td>{item}</td>
                                            <td>{data?.date}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table >
                    </div >
                    : ""
            }
        </>
    )
}

export default CheckStatus