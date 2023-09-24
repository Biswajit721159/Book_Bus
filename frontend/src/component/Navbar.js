import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import {MdOutlineDarkMode} from 'react-icons/md';

const Navbar=()=>{

  const history=useNavigate();
  const user=JSON.parse(localStorage.getItem('user'));
  const [mode,setmode]=useState(localStorage.getItem('mode'))

  function logout(){
    localStorage.removeItem('user');
    history('/')
  }

  useEffect(()=>{
    givecolor(localStorage.getItem('mode'));
  },[])

  function givecolor(color)
  {
    if(color==null)
    {
      localStorage.setItem('mode','light')
      setmode('light')
      givecolor('light')
    }
    else if(color=='light')
    {
      document.body.style.backgroundColor = "white";
    }
    else
    {
      document.body.style.backgroundColor = "#BFC9CA";
    }
  }

  function changecolor()
  {
    if(mode==null)
    {
      localStorage.setItem('mode','light')
      setmode('light')
      givecolor('light')
    }
    else if(mode=='light')
    {
      localStorage.setItem('mode','dark')
      setmode('dark')
      givecolor('dark')
    }
    else
    {
      localStorage.setItem('mode','light')
      setmode('light')
      givecolor('light')
    }
  }
  
    return(
        <>
            <ul >
             <div className='container1'>
                <li><Link to={'/'} style={{textDecoration:"none",color:"black"}}>Home</Link></li>
                <li><Link to={'/BookBus'} style={{textDecoration:"none",color:"black"}}>Book Bus</Link></li>
                <li><Link to={'/checkstatus'} style={{textDecoration:"none",color:"black"}}>check status</Link></li>
              {user ?
                <>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Welcome {user.user.name}
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to='/LastTransaction'> My Transaction</Link></li>
                            <li><Link className="dropdown-item"to={'/WishList'}>My WishList</Link></li> 
                            <li><Link className="dropdown-item" to="/MasterList">My MasterList</Link></li>
                            <li><Link className="dropdown-item" to={'/Login'} onClick={logout}>Logout</Link></li>
                        </ul>
                    </div>
                </>    
                :
                <>
                    <li><Link to={'/Login'} style={{textDecoration:"none",color:"black"}}>Login</Link></li>
                    <li><Link to={'/Register'}style={{textDecoration:"none",color:"black"}}>Register</Link></li>
                </>
                }
                {
                  mode=="light"?
                  <li><button className='btn btn-light rounded-circle' onClick={changecolor}><MdOutlineDarkMode/></button></li>
                  :<li><button className='btn btn-dark rounded-circle' onClick={changecolor}><MdOutlineDarkMode/></button></li>
                }
            </div>   
            </ul>
        </>
    )
}
export default Navbar