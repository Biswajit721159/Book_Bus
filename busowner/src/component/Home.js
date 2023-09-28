import React, { useEffect, useState } from 'react'
import {Link, useNavigate } from "react-router-dom";
import loader from "../images/loader.gif"


const Home=()=>{
    const [data,setdata]=useState([])
    const history=useNavigate();
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const [load,setload]=useState(true)

    useEffect(()=>{
        if(userinfo==null)
        { 
            history('/Login') 
        }
        else
        { 
            loadData() 
        }
    },[])

    
    function loadData()
    {
        setload(true)
        fetch(`https://book-bus-api.vercel.app/busowner/${userinfo.user.email}`,{
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                auth:`bearer ${userinfo.auth}`
            }
        }).then(responce=>responce.json()).then((res)=>{
              setdata(res)
              setload(false)
        },(error)=>{
            history('*')
        })
    }


    return(
        <>
        {
            load==false?
           <div className='container'>
             <table className="table mt-5">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Bus Name</th>
                    <th scope="col">Total Seat</th>
                    <th scope="col">Src To Dist</th>
                    <th scope="col">Action Taken</th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {
                        data.map((item,ind)=>(
                            <tr key={ind}>
                                <th scope="row">{ind+1}</th>
                                <td>{item.bus_name}</td>
                                <td>{item.Total_seat}</td>
                                <th>*{item.station_data[0].station} - {item.station_data[(item.station_data.length)-1].station}</th>
                                <td><button className='btn btn-primary btn-sm' disabled>{item.status}</button></td>
                                <td><Link to={`/View_Bus/${item._id}`}><button className='btn btn-outline-primary btn-sm'>View More</button></Link></td>
                                <td><button className='btn btn-dark btn-sm' >Edit</button></td>
                                <td><button className='btn btn-danger btn-sm' >Delete</button></td>
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

export default Home