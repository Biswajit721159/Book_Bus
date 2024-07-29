import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { usermethod } from '../redux/UserSlice'
import Loader from './Loader'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { ClipLoader } from 'react-spinners';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
const api = process.env.REACT_APP_API
const LastTransaction = () => {

    const userinfo = useSelector((state) => state.user)
    const history = useNavigate();
    const [data, setdata] = useState([])
    const [load, setload] = useState(true)
    const dispatch = useDispatch()
    const [wishlistLoader, setWishlistLoader] = useState(false);
    const [wishListId, setWishListId] = useState();

    function loadTicket() {
        fetch(`${api}/Booking/getTicket/${userinfo?.user?.user?.email}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode === 200) {
                setload(false)
                setdata(res.data)
            } else if (res.statusCode === 498) {
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
        if (!userinfo?.user?.auth) {
            history('/Login')
        }
        else {
            loadTicket();
        }
    }, [])

    const addToWishList = async (id, is_wishlist) => {
        if (wishlistLoader) {
            return;
        }
        setWishlistLoader(true);
        setWishListId(id);
        let response = await fetch(`${api}/Booking/addAndRemoveFromWishList`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.user?.auth}`
            },
            body: JSON.stringify({
                id: id,
                is_wishlist: is_wishlist === true ? "no" : "yes",
            })
        })
        let booking = await response.json();
        booking = booking?.data;
        let newBookings = data?.map((item) => {
            if (item?._id === booking?._id) {
                return booking;
            } else {
                return item;
            }
        })
        setdata(newBookings);
        setWishlistLoader(false);
    }

    return (
        <>
            {
                load === false ?
                    <div className='container mt-5'>
                        {data?.length ?
                            <table className="table border shadow">
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-center">#</th>
                                        <th scope="col" className="text-center">Source</th>
                                        <th scope="col" className="text-center">Dastination</th>
                                        <th scope="col" className="text-center">Date</th>
                                        <th scope="col" className="text-center">Total Money</th>
                                        <th scope="col" className="text-center">WishList</th>
                                        <th scope="col" className="text-center">View Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.length && data?.map((item, ind) => (
                                            <tr className='m-10' key={ind}>
                                                <th className="text-center" scope="row">{ind + 1}</th>
                                                <td className="text-center">{item.src}</td>
                                                <td className="text-center">{item.dist}</td>
                                                <td className="text-center">{item.date}</td>
                                                <td className="text-center">₹{item.total_money}</td>
                                                <td className="text-center">
                                                    {
                                                        wishlistLoader === true && wishListId === item._id ?
                                                            <ClipLoader className='starloader' size={'12px'} color="blue" /> :
                                                            <Tooltip title={item?.is_wishlist ? "Remove from wishList" : "Add to wishList"} >
                                                                <FavoriteRoundedIcon
                                                                    onClick={() => addToWishList(item?._id, item?.is_wishlist)}
                                                                    style={{ color: item?.is_wishlist ? 'red' : 'default' }}
                                                                />
                                                            </Tooltip>
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <Link to={`/${item._id}`}>
                                                        <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'none' }}>View more</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            : "No Transaction Found"
                        }
                    </div>
                    : <Loader />
            }
        </>
    )
}

export default LastTransaction