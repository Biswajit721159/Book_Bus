import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import loader from "../User/loader.gif"


const MasterList=()=>{
    const [name,setname]=useState("")
    const [wrongname,setwrongname]=useState(false)
    const [messname,setmessname]=useState("")
    const [add,setadd]=useState(true)
    const [data,setdata]=useState([])
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const history=useNavigate();
    const [Submit,setSubmit]=useState("Submit")
    const [disable,setdisable]=useState(false)
    const [load,setload]=useState(true)
    const [DeleteButton,setDeleteButton]=useState("Delete")
    const [Deletedisable,setDeletedisable]=useState(false)
    const [takeid,settakeid]=useState('')
    // const [updatename,setupdatename]=useState("")
    const [updateinput,setupdateinput]=useState(false)
    const [update_id,setupdate_id]=useState('')

    const [disableupdate,setdisableupdate]=useState(false)
    const [updatebutton,setupdatebutton]=useState("Update")

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
    
    function loaddata()
    {
        setload(true)
        fetch(`https://book-bus-blue.vercel.app//MasterList/${userinfo.user.email}`,{
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

    function addhtml()
    {
        setadd(false)
    }

    function submit()
    {
        setdisable(true)
        setSubmit("Please Wait....")
        fetch(`https://book-bus-blue.vercel.app//MasterList/${userinfo.user.email}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                    auth:`bearer ${userinfo.auth}`
            },
            body:JSON.stringify({
                email:userinfo.user.email,
                name:name
            })
        }).then(response=>response.json()).then((res)=>{
            if(res!=undefined)
            {
                setadd(true)
                setdisable(false)
                setSubmit("Submit")
                setname("")
                loaddata()
            }
        },(error)=>{
            console.log(error)
        })
    }

    function Delete_user(id)
    {
        settakeid(id)
        setDeleteButton("Please Wait...")
        setDeletedisable(true)
        fetch(`https://book-bus-blue.vercel.app//MasterList/${userinfo.user.email}`,{
              method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                        auth:`bearer ${userinfo.auth}`
                },
                body:JSON.stringify({
                    _id:id
                })
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined)
                {
                    setdata(res)
                }
            },(error)=>{
                console.log(error)
        })
    }

    function Update(id,name)
    {
        setupdate_id(id)
        setupdateinput(true)
        setname(name)
    }
    
    function ActualUpdate(id)
    {
        setupdatebutton("Please Wait...")
        setdisableupdate(true)
        fetch(`https://book-bus-blue.vercel.app//MasterList/${userinfo.user.email}`,{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                        auth:`bearer ${userinfo.auth}`
                },
                body:JSON.stringify({
                    _id:id,
                    name:name
                })
            }).then(responce=>responce.json()).then((res)=>{
                if(res!=undefined)
                {
                    setdata(res)
                    setupdatebutton("Update")
                    setdisableupdate(false)
                    setupdate_id('')
                }
            },(error)=>{
                console.log(error)
        })
    }

    return(
        <>
        {
            load==false?
                <div className="container">
                    <div className="row">
                        {
                            add==true?
                            <div className="col"><button className="btn btn-primary mt-2" onClick={addhtml}>Add+</button></div>
                            :
                            <>
                                <div className="col">
                                    <div className="form-group mt-2">
                                        <input type="text" value={name} onChange={(e)=>{setname(e.target.value)}}  className="form-control" placeholder="Enter Full Name"  required/>
                                        {wrongname?<label  style={{color:"red"}}>{messname}</label>:""}
                                    </div>
                                </div>
                                <div className="col"><button className="btn btn-success mt-2" disabled={disable} onClick={submit}>{Submit}</button></div>
                            </>
                        }
                    </div>
                    <table class="table mt-3">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">#Action1</th>
                                <th scope="col">#Action2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item,ind)=>(
                                    <tr key={ind}>
                                        <th >{ind+1}</th>
                                        {
                                            updateinput==true && update_id==item._id?
                                            <div className="form-group">
                                                <input type="text" style={{backgroundColor:"#BFC9CA"}} value={name} onChange={(e)=>{setname(e.target.value)}}  className="form-control" placeholder="Enter Full Name"  required/>
                                                {wrongname?<label  style={{color:"red"}}>{messname}</label>:""}
                                            </div>
                                            :<td>{item.name}</td>
                                        }
                                        {
                                            updateinput==true && update_id==item._id?
                                            <td><button className="btn btn-primary" disabled={disableupdate} onClick={()=>ActualUpdate(item._id)}>{updatebutton}</button></td>
                                            :<td><button className="btn btn-primary" onClick={()=>Update(item._id,item.name)}>Update</button></td>
                                        }
                                        {
                                            item._id==takeid?<td><button className="btn btn-danger" disabled={Deletedisable} onClick={()=>Delete_user(item._id)}>{DeleteButton}</button></td>
                                            :<td><button className="btn btn-danger"  onClick={()=>Delete_user(item._id)}>Delete</button></td>
                                        }
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
export default MasterList