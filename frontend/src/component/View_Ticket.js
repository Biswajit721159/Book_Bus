import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { IoIosStarOutline } from "react-icons/io";
import { MdStar } from "react-icons/md";
import { ClipLoader } from 'react-spinners';
import Loader from './Loader';
import Button from '@mui/material/Button';
import '../stylesheet/ViewTicket.css'
import { usermethod } from '../redux/UserSlice'
const api = process.env.REACT_APP_API
const View_Ticket = () => {

    const userinfo = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const { _id } = useParams();
    const history = useNavigate();
    const [load, setload] = useState(true)
    const [data, setdata] = useState()
    const [key_value, setkey_value] = useState()
    const [isFavouriteJourney, setisFavouriteJourney] = useState(false)
    const [FavouriteJourneyLoader, setFavouriteJourneyLoader] = useState(false)

    function set_data(nums) {
        let arr1 = nums.person;
        let arr2 = nums.seat_record;
        let arr = []
        for (let i = 0; i < arr1.length; i++) {
            let obj = {
                personName: arr1[i],
                personSeat: arr2[i]
            }
            arr.push(obj)
        }
        setkey_value([...arr])
    }

    function loaddata() {
        setload(true)
        fetch(`${api}/Booking/getTicketByid/${_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode === 200) {
                setload(false)
                setdata(res?.data)
                set_data(res?.data)
                setisFavouriteJourney(res?.data?.isFavouriteJourney)
            }
            else if (res.statusCode === 498) {
                dispatch(usermethod.Logout_User())
                history('/Login')
            }
            else {
                history('*')
            }
        }, (error) => {
            history('*')
        })
    }

    useEffect(() => {
        if (!userinfo?.user) {
            history('/Login')
        }
        else {
            loaddata()
        }
    }, [])

    function Downlode() {
        console.log("downlode pdf ")
    }

    function AddToFavouriteJourney() {
        setFavouriteJourneyLoader(true)
        fetch(`${api}/FavouriteJourney/AddFavouriteJourney`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            },
            body: JSON.stringify({
                'email': userinfo?.user?.user?.email,
                'booking_id': _id
            })
        }).then((res) => res.json()).then((data) => {
            if (data?.statusCode === 201) {
                setisFavouriteJourney(true)
            }
            else if (data?.statusCode === 498) {
                dispatch(usermethod.Logout_User())
                history('/Login')
            }
            setFavouriteJourneyLoader(false)
        }).catch((error) => {
            setFavouriteJourneyLoader(false)
        })
    }

    function RemoveFromFavouriteJourney() {
        setFavouriteJourneyLoader(true)
        fetch(`${api}/FavouriteJourney/RemoveFavouriteJourney/${_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            },
        }).then((res) => res.json()).then((data) => {
            if (data?.statusCode === 200) {
                setisFavouriteJourney(false)
            }
            else if (data?.statusCode === 498) {
                dispatch(usermethod.Logout_User())
                history('/Login')
            }
            setFavouriteJourneyLoader(false)
        }).catch((error) => {
            setFavouriteJourneyLoader(false)
        })
    }

    return (
        <>
            {
                load == false ?
                    <div className='container shadow mt-5'>
                        {FavouriteJourneyLoader === true ? <ClipLoader className='starloader' size={'20px'} color="#36d7b7" /> :
                            isFavouriteJourney === false ? <IoIosStarOutline onClick={AddToFavouriteJourney} className='startButton' /> :
                                <MdStar onClick={RemoveFromFavouriteJourney} color='red' className='startButton' />}
                        <Button style={{ float: 'right', marginTop: '5px' }} variant="contained" color="primary" onClick={Downlode}>
                            Downlode
                        </Button>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Bus name-</th>
                                    <th scope="col">{data?.bus_name}</th>
                                    <th scope="col">Total Distance- {data?.total_distance} km</th>
                                    <th scope="col">Booking date- </th>
                                    <th scope="col">{data?.booking_date}</th>
                                </tr>
                                <tr>
                                    <td scope="col">Arrival date- </td>
                                    <td scope="col">{data?.date}</td>
                                    <td scope="col">Total Rupees- ₹{data?.total_rupees}</td>
                                    <th scope="col">Id- <Link style={{ textDecoration: "none" }}>{data?._id}</Link></th>
                                    <td scope="col">{data?.src}  -  {data?.dist}</td>
                                </tr>
                            </thead>
                            <thead>
                                <tr className='mt-5'>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Seat No.</th>
                                    <th scope="col">Rupees</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    key_value && key_value?.map((item, ind) => (
                                        <tr key={ind}>
                                            <th scope="row">{ind + 1}</th>
                                            <td>{item?.personName}</td>
                                            <td>{item?.personSeat}</td>
                                            <td>₹{parseInt(data?.total_rupees) / parseInt(key_value?.length)}</td>
                                            <td><button className='btn btn-danger btn-sm'>Cancel Ticket</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    : <Loader />
            }
        </>
    )
}

export default View_Ticket