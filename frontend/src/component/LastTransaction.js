import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { usermethod } from '../redux/UserSlice'
import Loader from './Loader'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { ClipLoader } from 'react-spinners';
const api = process.env.REACT_APP_API
const LastTransaction = () => {

    const userinfo = useSelector((state) => state.user)
    const history = useNavigate();
    const [data, setdata] = useState([])
    const [load, setload] = useState(true)
    const dispatch = useDispatch()
    const [wishlistLoader, setWishlistLoader] = useState(false);

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
        setWishlistLoader(true);
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
        setWishlistLoader(false);
        console.log(response);
    }

    return (
        <>
            {
                load == false ?
                    <div className='container mt-5'>
                        {data.length ? <table className="table">
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
                                        <tr className='' key={ind}>
                                            <th className="text-center" scope="row">{ind + 1}</th>
                                            <td className="text-center">{item.src}</td>
                                            <td className="text-center">{item.dist}</td>
                                            <td className="text-center">{item.date}</td>
                                            <td className="text-center">₹{item.total_money}</td>
                                            <td className="text-center">
                                                {
                                                    wishlistLoader === true ?
                                                        <ClipLoader className='starloader' size={'20px'} color="blue" /> :
                                                        <FavoriteRoundedIcon onClick={() => addToWishList(item?._id, item?.is_wishlist)}
                                                            style={{ color: item?.is_wishlist && 'blue' }}
                                                        />
                                                }
                                            </td>
                                            <td className="text-center"><Link to={`/${item._id}`}><button className='btn btn-primary btn-sm'>View more</button></Link></td>
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