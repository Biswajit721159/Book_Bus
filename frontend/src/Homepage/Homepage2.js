import React from 'react';
import Table3 from '../images/bus-4.jpg'
import {AiFillPhone } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import '../stylesheet/Homepage2.css'
const Homepage2=()=>{
    return(
        <div className=' mt-1 shadow-none p-3 mb-5 bg-light rounded'>
        <h3 className='headline1' >About us</h3>
        <h1 className='headline2'  > WHY CHOOSE US? </h1>
        <div > 
            <div className="imageitem">
                <img src={Table3} className="imageitem" alt="Error"/>
            </div>
            <div className='mt-2'>
                <h3 className='headline2'>Best Quality Furniture in the country</h3>
                <p className='headline1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, sequi corrupti corporis quaerat voluptatem ipsam neque labore modi autem, saepe numquam quod reprehenderit rem? Tempora aut soluta odio corporis nihil!</p>
                <p className='headline1'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, nemo. Sit porro illo eos cumque deleniti iste alias, eum natus.</p>


                <div className="row1 mt-5">
                    <div className="col1 shadow p-2 mb-5 bg-white rounded" >
                        <FaBus  className='icon' />
                        <span className='headline1'>On Time </span>
                    </div>
                    <div className="col1 shadow p-2 mb-5 bg-white rounded" >
                        <FaRupeeSign  className='icon'/>
                        <span className='headline1'>Easy Payments</span>
                    </div>
                    <div className="col1 shadow p-2 mb-5 bg-white rounded" >
                        <AiFillPhone  className='icon' />
                        <span className='headline1'>24/7 Service</span>
                    </div>
                </div>    


            </div>
        </div> 
    </div>
    )
}

export default Homepage2