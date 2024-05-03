import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const Navbar =()=>{
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const history=useNavigate();

    function logout()
    {
        localStorage.removeItem('user');
        history('/Login')
    }

    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid" >
                    <p className="navbar-brand" >BusOwner Adminpanel</p>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                       <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" style={{marginLeft:"200px"}} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                       <Link className="nav-link" to="/">Home</Link>
                    </li>
                       {
                        userinfo==null?
                           <>
                           
                               <li className="nav-item">
                                    <Link className="nav-link" to={'/Login'}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={'/Register'}>Register</Link>
                                </li>
                           </>
                            :
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to={'/Bus_adder'}>AddBus</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={'/ViewSeat'}>View Seat</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Welcome {userinfo.user.name}
                                    </a>
                                    {/* <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul> */}
                                </li>
                            </>
                       }
                    </ul>
                    {
                        userinfo?
                        <div className="d-flex">
                            <button className="btn btn-success btn-sm" type="submit" onClick={logout}>Logout <i className="fa fa-sign-out" aria-hidden="true"></i></button>
                        </div>:""
                    }
                    </div>
                </div>
            </nav>
         </>
    )
}

export default Navbar