import React, { useState,useEffect }  from "react";
import { json, useNavigate } from "react-router-dom";
const Bus_adder=()=>{
    const userinfo=JSON.parse(localStorage.getItem('user'))

    useEffect(()=>{
        console.log(userinfo.user.email)
        if(userinfo==null)
        {
            history('/Login')
        }
    },[])
    const history=useNavigate()
    const [name,setname]=useState("")
    const [messname,setmessname]=useState("")
    const [wrongname,setwrongname]=useState(false)
    
    const [station,setstation]=useState("")
    const [messstation,setmessstation]=useState("")
    const [wrongstation,setwrongstation]=useState(false)

    const [arrived_time,setarrived_time]=useState("")
    const [messarrived_time,setmessarrived_time]=useState("")
    const [wrongarrived_time,setwrongarrived_time]=useState(false)


    const [seat,setseat]=useState("")
    const [messseat,setmessseat]=useState("")
    const [wrongseat,setwrongseat]=useState(false)

    const [Distance,setDistance]=useState("")
    const [messDistance,setmessDistance]=useState("")
    const [wrongDistance,setwrongDistance]=useState(false)

    const [button,setbutton]=useState("Final Submit")
    const [disabled,setdisabled]=useState(false)

    const [islast_station,setislast_station]=useState(false)
    const [show_html,setshow_shtml]=useState(false)

    const [data,setdata]=useState([]) //just add

    function add_into_list()
    {
        // console.log(name)
        // console.log(seat)
        // console.log(station)
        // console.log(arrived_time)
        // console.log(Distance)
        // console.log(islast_station)
        setshow_shtml(islast_station)
        data.push({
            station:station,
            arrived_time:arrived_time,
            Distance_from_Previous_Station:Distance
        })
        // console.log(data)
        setdata([...data])
        setstation("")
        setarrived_time("")
        setDistance("")
    }
   
    function submit()
    {
        setdisabled(true)
        setbutton("Please Wait...")
        fetch('/busowner/addBus',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
               email:userinfo.user.email,
               bus_name:name,
               Total_seat:seat,
               station_data:data,
               status:'pending',
            })
        }).then(responce=>responce.json()).then((res)=>{
            history('/')
        },(error)=>{
            history('*')
        })
    }

    function Delete_station(ind)
    {
        data.splice(ind,1)
        setdata([...data])
    }


    return(
        <div className="container mt-3">
        { 
           data.length==0?
          <>
            <div className="col-md-4 mt-2">
                <div className="form-group">
                    <input type="text" value={name} onChange={(e)=>{setname(e.target.value)}}  className="form-control" placeholder="Enter Bus Name"  required/>
                    {wrongname?<label  style={{color:"red"}}>{messname}</label>:""}
                </div>
            </div>
            <div className="col-md-4 mt-2">
                <div className="form-group">
                    <input type="number" value={seat} onChange={(e)=>{setseat(e.target.value)}}  className="form-control" placeholder="Enter Total Seat"  required/>
                    {wrongseat?<label  style={{color:"red"}}>{messseat}</label>:""}
                </div>
            </div>
          </>
          :""
        }
        {
            data!=null && data.length!=0?
            <table className="table mt-3 table-primary">
                <thead>
                   <tr>
                        <th className="col text-center">Bus Name - </th>
                        <th className="col text-center">{name}</th>
                        <th className="col text-center">Total Seat</th>
                        <th className="col text-center">{seat}</th>
                        <th className="col text-center">-</th>
                        {/* <th className="col text-center">Update</th> */}
                    </tr>
                    <tr>
                        <th className="col text-center">Station No.</th>
                        <th className="col text-center">Station Name</th>
                        <th className="col text-center">Arrived Time</th>
                        <th className="col text-center">Distance From Previous Station</th>
                        <th className="col text-center">Delete</th>
                        {/* <th className="col text-center">Update</th> */}
                    </tr>
                </thead>
            {
                data.map((item,ind)=>(
                    <tbody key={ind}>
                        <tr>
                            <th className="text-center">{ind+1}</th>
                            <td className="text-center">{item.station}</td>
                            <td className="text-center">{item.arrived_time}</td>
                            <td className="text-center">{item.Distance_from_Previous_Station}</td>
                            {/* <td className="text-center"><button className="btn btn-primary btn-sm">Update</button></td> */}
                            <td className="text-center"><button className="btn btn-danger btn-sm" onClick={()=>Delete_station(ind)}>Delete</button></td>
                        </tr>
                    </tbody>
      
                ))
            }
            </table>
            :""
        }

        {
            show_html==false?    
           <>
                <div className="col-md-4 mt-2">
                    <div className="form-group">
                        <input type="text" value={station} onChange={(e)=>{setstation(e.target.value.toUpperCase())}}  className="form-control" placeholder="Enter Station Name"  required/>
                        {wrongstation?<label  style={{color:"red"}}>{messstation}</label>:""}
                    </div>
                </div>
                <div className="col-md-4 mt-2">
                    <div className="form-group">
                        <label style={{color:"green"}}>*Enter Arrived Time(24 Hour Format)</label>
                        <input type="time" value={arrived_time} onChange={(e)=>{setarrived_time(e.target.value)}}  className="form-control mt-2" placeholder="Enter Arrived Time"  required/>
                        {wrongarrived_time?<label  style={{color:"red"}}>{messarrived_time}</label>:""}
                    </div>
                </div>
                <div className="col-md-4 mt-2">
                    <div className="form-group">
                        <input type="number" value={Distance} onChange={(e)=>{setDistance(e.target.value)}}  className="form-control" placeholder="Distance from Previous Station"  required/>
                        {wrongDistance?<label  style={{color:"red"}}>{messDistance}</label>:""}
                    </div>
                </div>
                <div className="form-check mt-2">
                    <input className="form-check-input" type="checkbox" onChange={(e)=>{setislast_station(e.target.checked)}} id="flexCheckDefault"/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Is this the Last Station
                    </label>
                </div>
                <div className="col-md-4 mt-3">
                    <button className="btn btn-primary" onClick={add_into_list}>Add Into Your List</button>
                </div>
            </>  
            :""
        }
        {show_html==true?
            <div className="col-md-4 mt-3">
                 <button className="btn btn-primary" disabled={disabled} onClick={submit}>{button}</button>
            </div>
        :""
        }
        </div>
    )
}
export default Bus_adder