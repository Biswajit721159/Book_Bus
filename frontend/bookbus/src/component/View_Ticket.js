import React, { useEffect,useState } from'react'
import { Link,json,useNavigate,useParams,useLocation } from 'react-router-dom';
import loader from "../User/loader.gif"


const View_Ticket=()=>{

    const userinfo=JSON.parse(localStorage.getItem('user'));
    const {_id}=useParams();
    const history=useNavigate();
    const [load,setload]=useState(true)
    const[data,setdata]=useState([])
    const[key_value,setkey_value]=useState([])
    const [busname,setbusname]=useState("")

    function set_data(nums)
    {
        let arr1=nums[0].person;
        let arr2=nums[0].seat_record;
        let arr=[]
        for(let i=0;i<arr1.length;i++)
        {
            let obj={
                personName:arr1[i],
                personSeat:arr2[i]
            }
            arr.push(obj)
        }
        setkey_value([...arr])
    }

    function loaddata()
    {
        setload(true)
        fetch(`https://book-bus-blue.vercel.app//getTicketByid/${_id}`,{
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                     auth:`bearer ${userinfo.auth}`
                }
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined && res.length!=0)
                {
                    fetch(`https://book-bus-blue.vercel.app//bus_detail/${res[0].bus_id}`,{
                        headers:{
                                'Accept':'application/json',
                                'Content-Type':'application/json',
                            }
                        }).then(responce=>responce.json()).then((result)=>{
                            if(res!=undefined)
                            {
                                setload(false) 
                                setdata(res)
                                set_data(res)
                                setbusname(result[0].bus_name)
                            }
                        },(error)=>{
                            console.log(error)
                    })
                }
                else
                {
                    history('*')
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
            loaddata()
        }
    },[])


    return(
        <>
           {
               load==false?
                <div className='container shadow mt-5'>

                    <table className="table">
                        <thead>
                            <tr>
                                <td scope="col">Bus Name:-</td>
                                <th scope="col">{busname}</th>
                                <td scope="col">Total Distance:-</td>
                                <th scope="col">{data[0].total_distance} KM</th>
                                <td scope="col">PNR NO - <Link  style={{textDecoration:"none"}}>{data[0]._id}</Link></td>
                            </tr>
                       </thead>
                       <thead >
                            <tr className='mt-5'>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Seat No.</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                       </thead>
                       <tbody>
                            {
                                key_value.map((item,ind)=>(
                                    <tr key={ind}>
                                        <th scope="row">{ind+1}</th>
                                        <td>{item.personName}</td>
                                        <td>{item.personSeat}</td>
                                        <td>{data[0].date}</td>
                                        <td><button className='btn btn-danger btn-sm'>Cancil</button></td>
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

export default View_Ticket