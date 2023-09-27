import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Home=()=>{
    const [data,setdata]=useState([])
    const history=useNavigate();
    const userinfo=JSON.parse(localStorage.getItem('user'))

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
        fetch(`https://book-bus-api.vercel.app/busowner/${userinfo.user.email}`,{
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                auth:`bearer ${userinfo.auth}`
            }
        }).then(responce=>responce.json()).then((res)=>{
              console.log(res)
            },(error)=>{
                history('*')
            })
    }


    return(
        <>
          Home Page
        </>
    )
}

export default Home