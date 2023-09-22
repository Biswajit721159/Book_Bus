import React, { useEffect, useState, useTransition } from "react";
import { Form, Link,useNavigate } from 'react-router-dom';
import loader from "../User/loader.gif"
import Swal from 'sweetalert2'

const Home=()=>{
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const [data,setdata]=useState([])
    const [load,setload]=useState(true)
    const [src,setsrc]=useState("");
    const [dist,setdist]=useState("")
    const [date,setdate]=useState(today)
    const [disabled,setdisabled]=useState(false)
    const [button,setbutton]=useState("Find Bus")
    const [bus,setbus]=useState([])
    const [bus__id,setbus__id]=useState('')
    const [show_seat_button,setshow_seat_button]=useState("Show Seat")
    const [disabled_showseat,setdisabled_showseat]=useState(false)
    const [Available_seat,setAvailable_seat]=useState(0)
    const [seat_res_come,setseat_res_come]=useState(false)


    const [erroInSrc,seterroInSrc]=useState(false)
    const [messerroInSrc,setmesserroInSrc]=useState("")

    const [errordist,seterrordist]=useState(false)
    const [messerrordist,setmesserrordist]=useState("")

    const [errordate,seterrordate]=useState(false)
    const [messerrordate,setmesserrordate]=useState("")

    useEffect(()=>{
        fetch('http://localhost:5000/get_station').then(responce=>responce.json()).then((res)=>{
            if(res!=undefined)
            {
                setdata(res)
                fetch('http://localhost:5000/FirstFiveBus/').then(responce=>responce.json()).then((result)=>{
                    setload(false)
                    setbus(result)
                },(error)=>{
                    console.log(error)
                })
            }
        },(error)=>{
            console.log(error)
        })
    },[])

    function FindError()
    {
        let x=true
        if(src=="Select Your Source Station" || src.length==0)
        {
            seterroInSrc(true)
            setmesserroInSrc("*Select A Station")
            x=false
        }
        if(dist=="Select Your Source Station" || dist.length==0)
        {
            seterrordist(true)
            setmesserrordist("*Select A Station")
            x=false
        }
        if(date.length==0)
        {
            seterrordate(true)
            setmesserrordate("*Select A Date")
            x=false
        }
        return x;
    }

    function findbus()
    {
        let ans=FindError();
        if(ans==true)
        {
            seterroInSrc(false)
            seterrordist(false)
            seterrordate(false)

            setdisabled(true)
            setbutton("Wait Finding...")
            fetch('http://localhost:5000/get_bus',{
                method:'PATCH',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    start_station:src,
                    end_station:dist
                })
            }).then(response=>response.json()).then((res)=>{
                if(res!=undefined)
                {
                    setdisabled(false)
                    setbutton("Find Bus")
                    setbus(res)
                }
            },(error)=>{
                console.log(error)
            })
        }
    }

    function show_seat(_id,src,dist)
    {
        if(date.length<10)
        {
            Swal.fire("Please Select a Date!")
            return;
        }
        setbus__id(_id)
        setseat_res_come(false)
        setdisabled_showseat(true)
        setshow_seat_button("Loading....")
        fetch('http://localhost:5000/get_Seat',{
            method:'PATCH',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                start_station:src,
                end_station:dist,
                date:date,
                bus_id:_id,
            })
        }).then(responce=>responce.json()).then((res)=>{
            if(res!=undefined)
            {
                setAvailable_seat(res.nowAvailable_seat)
                setdisabled_showseat(false)
                setshow_seat_button("Show Seat")
                setseat_res_come(true)
            }
        },(error)=>{
            console.log(error)
        })
    }

    const minDate = () => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    };

    return(
        <>
           {
              load==false?
                <form onSubmit={(e)=>{ e.preventDefault(); findbus()}}>

                    <div className="d-flex align-items-center justify-content-center mt-5">
                        <div className="d-flex ">
                            <select className="form-select" aria-label="Default select example" required onChange={(e)=>{setsrc(e.target.value)}} style={{backgroundColor:"white"}}>
                                <option style={{textAlign:"center"}} selected>Select Your Source Station</option>
                                {
                                    data.map((item,ind)=>(
                                        <option key={ind} style={{textAlign:"center"}} >{item}</option>
                                    ))
                                }
                            </select>
                            {erroInSrc?<label className="mt-0" style={{color:"red"}}>{messerroInSrc}</label>:""}
                        </div>
                        <div className="d-flex ">
                            <i className="fa fa-arrow-circle-right d-flex justify-content-center" style={{fontSize:"38px", color:"green" ,textAlign:"center"}}></i>
                        </div>
                        <div className="d-flex ">
                            <select className="form-select" aria-label="Default select example" required onChange={(e)=>{setdist(e.target.value)}}>
                                <option style={{textAlign:"center"}} selected>Select Your Distination Station</option>
                                {
                                    data.map((item,ind)=>(
                                        <option key={ind} style={{textAlign:"center"}} >{item}</option>
                                    ))
                                }
                            </select>
                            {errordist?<label className="mt-0" style={{color:"red"}}>{messerrordist}</label>:""}
                        </div>
                        <div className="d-flex ">
                            <div className="input-group date" id="datepicker">
                                <input type="date" className="form-control" value={date} min={minDate()} onChange={(e)=>{setdate(e.target.value)}} required id="date"/>
                            </div>
                            {errordate?<label className="mt-0" style={{color:"red"}}>{messerrordate}</label>:""}
                        </div>
                        <div className="d-flex d-flex justify-content-center mx-1">
                            <button type="submit" className="btn btn-primary btn-block " disabled={disabled}  >{button}</button>
                        </div>  
                    </div>
                    
                </form>
             :<div className='loader-container'><img src={loader} /></div>
           }
            <table className=" container table mt-5">
                <thead>
                    <tr>
                        <th scope="col">Bus Name</th>
                        <th scope="col">Starting Station</th>
                        <th scope="col">Arrived Time</th>
                        <th scope="col">Distance</th>
                        <th scope="col">Departure Time</th>
                        <th scope="col">Ending Station</th>
                        <th scope="col">View Bus</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
               <tbody >
                {
                    bus.length!=0 ?
                    bus.map((item,ind)=>(
                        <tr key={ind}  style={{height: "75px"}}>
                            <td>{item.bus_name}</td>
                            <td>{item.start_station}</td>
                            <td>{item.start_arrived_time}</td>
                            <td>{item.total_distance}</td>
                            <td>{item.end_arrive_time}</td>
                            <td>{item.end_station}</td>
                            <td><Link to={`/View_Bus/${item.bus_id}`}><button className="btn btn-outline-primary btn-sm">view</button></Link></td>
                            {
                                item.bus_id!=bus__id?
                                <td><button className="btn btn-danger btn-sm" onClick={()=>{show_seat(item.bus_id,item.start_station,item.end_station)}} >Show Seat</button></td>
                                :
                                    seat_res_come==true?
                                    <td>
                                        <button className="btn btn-primary btn-sm" disabled={true} >{Available_seat} Left </button>
                                        <Link to={`/${item.bus_id}/${item.start_station}/${item.end_station}/${date}`}>
                                            <button className="btn btn-primary btn-sm mx-2">
                                                Book Now
                                            </button>
                                        </Link>
                                    </td>
                                    :
                                    <td>
                                        <button className="btn btn-danger btn-sm" disabled={disabled_showseat} onClick={()=>{show_seat(item.bus_id,item.start_station,item.end_station)}} >
                                            {show_seat_button}
                                        </button>
                                    </td>
                            }                      
                        </tr>
                    ))
                    :<tr >
                        <td>Na</td>
                        <td>Na</td>
                        <td>Na</td>
                        <td>Na</td>
                        <td>Na</td>
                        <td>Na</td>
                        <td>Na</td>
                        <td></td>     
                    </tr>
                }
               </tbody>
            </table>
        </>
    )
}
export default Home