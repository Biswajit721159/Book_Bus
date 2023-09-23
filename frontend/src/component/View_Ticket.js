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
        fetch(`https://book-bus-api.vercel.app/getTicketByid/${_id}`,{
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                     auth:`bearer ${userinfo.auth}`
                }
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined && res.length!=0)
                {
                    fetch(`https://book-bus-api.vercel.app/bus_detail/${res[0].bus_id}`,{
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
                                console.log(res)
                            }
                        },(error)=>{
                            history('*')
                    })
                }
                else
                {
                    history('*')
                }
            },(error)=>{
                history('*')
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
                                <th scope="col">Bus Name:-</th>
                                <th scope="col">{busname}</th>
                                <th scope="col">Total Distance:-</th>
                                <th scope="col">{data[0].total_distance} km</th>
                                <th scope="col">PNR NO - <Link  style={{textDecoration:"none"}}>{data[0]._id}</Link></th>
                            </tr>
                            <tr>
                                <td scope="col">Date</td>
                                <td scope="col">{data[0].date}</td>
                                <td scope="col">Total Money:-</td>
                                <td scope="col">₹{data[0].total_money}</td>
                                <td scope="col">{data[0].src}  -  {data[0].dist}</td>
                            </tr>
                       </thead>
                       <thead >
                            <tr className='mt-5'>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Seat No.</th>
                                <th scope="col">Money</th>
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
                                        <td>₹{parseInt (data[0].total_money)/parseInt (key_value.length)}</td>
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