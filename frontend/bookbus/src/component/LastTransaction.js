import React, { useEffect, useState } from 'react'
import { Link, json, useNavigate, useSearchParams } from "react-router-dom";
import loader from "../User/loader.gif"

const LastTransaction=()=>{
    
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const history=useNavigate();
    const [data,setdata]=useState([])
    const [load,setload]=useState(true)

    function loadTicket()
    {
        fetch(`http://localhost:5000/getTicket/${userinfo.user.email}`,{
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    auth:`bearer ${userinfo.auth}`
                }
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined)
                {
                    setload(false)
                    setdata(res)
                }
            },(error)=>{
                console.log(error)
        })
    }

    useEffect(()=>{
        if(userinfo==null)
        {
            history('/Login')
        }
        else
        {
            loadTicket();
        }
    },[])

    return(
        <>
           {
              load==false?
              <div className='container mt-5'>
                <table class="table">
                  <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Source</th>
                            <th scope="col">Dastination</th>
                            <th scope="col">Date</th>
                            <th scope="col">Total Money</th>
                            <th scope="col">View Detail</th>
                        </tr>
                  </thead>
                  <tbody>
                        {
                            data.map((item,ind)=>(
                                <tr className=''>
                                    <th scope="row">{ind+1}</th>
                                    <td>{item.src}</td>
                                    <td>{item.dist}</td>
                                    <td>{item.date}</td>
                                    <td>₹{item.total_money}</td>
                                    <td><Link to={`/${item._id}`}><button className='btn btn-primary'>View more</button></Link></td>
                                </tr>
                            ))
                        }
                  </tbody>
                </table>
              </div>
              :<div className='loader-container'><img src={loader} /></div>
           }
        </>
    )
}

export default LastTransaction