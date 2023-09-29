import React, { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import loader from "../images/loader.gif"


const ViewSeat=()=>{

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const [disabled,setdisabled]=useState(false)
    const [button,setbutton]=useState("Find Bus")

    const [data,setdata]=useState([])
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const history=useNavigate()
    const [load,setload]=useState(true)
    const [date,setdate]=useState(today)

    const [src,setsrc]=useState("");
    const [erroInSrc,seterroInSrc]=useState(false)
    const [messerroInSrc,setmesserroInSrc]=useState("")

    const [errordate,seterrordate]=useState(false)
    const [messerrordate,setmesserrordate]=useState("")
    const [bus,setbus]=useState([])


    function FindError()
    {
        let x=true
        if(src=="Select Your Source Station" || src.length==0)
        {
            seterroInSrc(true)
            setmesserroInSrc("*Select A Station")
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

    function loadproduct()
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

    useEffect(()=>{
        if(userinfo==null)
        {
            history('Login')
        }
        else
        {
            loadproduct()
        }
    },[])

    const minDate = () => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    };

    function findBusId()
    {
        for(let i=0 ; i< data.length ; i++)
        {
            if( data[i].bus_name == src )
            {
                return data[i]._id
            }
        }
        return null
    }

    function findbus()
    {
        if(FindError())
        {
            seterroInSrc(false)
            seterrordate(false)
            setdisabled(true)
            let y=findBusId()
            setbutton("Wait Finding...")
            fetch('https://book-bus-api.vercel.app/busowner/getBookingStatus',{
                method:'PATCH',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                     auth:`bearer ${userinfo.auth}`
                },
                body:JSON.stringify({
                    "date":date,
                    "bus_id":y
                })
            }).then(response=>response.json()).then((res)=>{
                if(res!=undefined)
                {
                    setdisabled(false)
                    setbutton("Find Bus")
                    setbus(res)
                    // console.log(date)
                    // console.log(findBusId())
                    console.log(res)
                }
            },(error)=>{
                history('*')
            })
        }
    }

    return (
        <>
        {
            load==false?
            <>
               <form onSubmit={(e)=>{ e.preventDefault(); findbus()}}>

                <div className="d-flex align-items-center justify-content-center mt-5">
                    <div className="d-flex ">
                        <select className="form-select" aria-label="Default select example" required onChange={(e)=>{setsrc(e.target.value)}} style={{backgroundColor:"white"}}>
                            <option style={{textAlign:"center"}} selected>Select Your Source Station</option>
                            {
                                data.map((item,ind)=>(
                                    <option key={ind} style={{textAlign:"center"}} >{item.bus_name}</option>
                                ))
                            }
                        </select>
                        {erroInSrc?<label className="mt-0" style={{color:"red"}}>{messerroInSrc}</label>:""}
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
                <div className="container">
                    {
                        bus.length!=0 ?
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                                </tr>
                            </thead>
                        <tbody>
                            {
                                bus.map((item,ind)=>(
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                ))
                            }
                           </tbody>
                        </table>
                        :""
                    }
                </div>
            </>
            :<div className='loader-container'><img src={loader} /></div>
        }
        </>
    )
}

export default ViewSeat