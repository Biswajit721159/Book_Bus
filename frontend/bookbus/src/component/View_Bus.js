import React, { useEffect, useState } from 'react'
import loader from "../User/loader.gif"
import { Link,json,useNavigate,useParams,useLocation } from 'react-router-dom';

const View_Bus =()=>{

    const [data,setdata]=useState()
    const [load,setload]=useState(true)
    const {_id}=useParams();
   
    function loaduser()
    {
        setload(true)
        fetch(`https://book-bus-blue.vercel.app/bus_detail/${_id}`,{
            headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                }
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined)
                {
                    setload(false)
                    setdata(res)
                    console.log(res)
                }
            },(error)=>{
                console.log(error)
        })
    }

    useEffect(()=>{
        loaduser()
    },[])
    

    return(
        <>
        {
            load==false?
               <div className='d-flex align-items-center justify-content-center mt-5'>
                    <div>
                    {
                        data.length!=0 && data[0].station_data.map((item,ind)=>(
                            <div>
                                <div className="mt-0">
                                    <h6>*{item.station} - {item.arrived_time}</h6>
                                </div>
                                <div className="mx-2 mt-0 d-flex align-items-center justify-content-center mt-1">
                                   <i className="fa fa-arrow-circle-down" style={{fontSize:"30px", color:"green" ,textAlign:"center"}}></i>
                                   <p className='mx-2 mt-3'>{item.Distance_from_Previous_Station}KM</p>
                                </div>
                            </div>
                        ))
                    }   
                    </div>
               </div>
            :<div className='loader-container'><img src={loader} /></div>
        }
        </>
    )
}

export default View_Bus