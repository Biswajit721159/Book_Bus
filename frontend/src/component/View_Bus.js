import React, { useEffect, useState } from 'react'
import loader from "../User/loader.gif"
import { Link,json,useNavigate,useParams } from 'react-router-dom';

const View_Bus =()=>{

    const [data,setdata]=useState()
    const [load,setload]=useState(true)
    const {_id}=useParams();
    const history=useNavigate();
   
    function loaduser()
    {
        setload(true)
        fetch(`https://book-bus-api.vercel.app/bus_detail/${_id}`,{
            headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                }
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined)
                {
                    setload(false)
                    setdata(res)
                }
            },(error)=>{
                history('*')
            })
    }

    useEffect(()=>{
        loaduser()
    },[])
    

    return(
        <>
        {
            load==false?
            <div className='container'>
                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th scope="col">Bus Name -</th>
                            <th scope="col">{data[0].bus_name}</th>
                            <th scope="col">Total No. Of Station -</th>
                            <th scope="col">{data[0].station_data.length}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                           <th scope="row">Bus ID -</th>
                            <th><Link style={{textDecoration:"none"}}>{data[0]._id}</Link></th>
                            <th>Total_seat</th>
                            <th>{data[0].Total_seat}</th>
                        </tr>
                    </tbody>
                </table>
               <div className='d-flex align-items-center justify-content-center mt-5'>
                    
                    <div>
                    {
                        data.length!=0 && data[0].station_data.map((item,ind)=>(
                            <div key={ind}>
                                <div className="mt-2">
                                    <h6>*{item.station} - {item.arrived_time} ({item.Distance_from_Previous_Station} km)</h6>
                                </div>
                                <div className="mx-2 mt-0 d-flex align-items-center justify-content-center mt-1">
                                   {
                                        (ind+1)==data[0].station_data.length?
                                        ""
                                        :<i className="fa fa-arrow-circle-down mt-2" style={{fontSize:"30px", color:"green" ,textAlign:"center"}}></i>
                                   }
                                </div>
                            </div>
                        ))
                    }   
                    </div>
               </div>     
            </div>
            :<div className='loader-container'><img src={loader} /></div>
        }
        </>
    )
}

export default View_Bus