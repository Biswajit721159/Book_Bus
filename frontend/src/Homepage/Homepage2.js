import React from "react";
import { AiFillCar, AiFillPhone, AiOutlineCheckCircle } from "react-icons/ai";
import bus4 from '../images/bus-4.jpg'
const Homepage2 = () => {
    return (
        <div className=' mt-1 shadow-none p-3 mb-5 bg-light rounded'>
            <h3 className='d-flex justify-content-center' style={{ color: "green" }}>about us</h3>
            <h1 className='d-flex justify-content-center'> WHY CHOOSE US? </h1>
            <div >
                <div className="image">
                    <img src={bus4} alt="" style={{ width: "100%", height: "500px" }} />
                </div>
                <div >
                    <h3>Best Quality Bus in the country</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, sequi corrupti corporis quaerat voluptatem ipsam neque labore modi autem, saepe numquam quod reprehenderit rem? Tempora aut soluta odio corporis nihil!</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, nemo. Sit porro illo eos cumque deleniti iste alias, eum natus.</p>
                    <div className="row d-flex justify-content-center-mt-3">
                        <div className="col shadow p-3 mb-5 bg-white rounded" style={{ border: "3px solid green", textAlign: "center" }}>
                            <AiFillCar />
                            <span>No Dealy</span>
                        </div>
                        <div className="col shadow p-3 mb-5 bg-white rounded" style={{ border: "3px solid green", textAlign: "center" }}>
                            <AiOutlineCheckCircle />
                            <span>Easy Payments</span>
                        </div>
                        <div className="col shadow p-3 mb-5 bg-white rounded" style={{ border: "3px solid green", textAlign: "center" }}>
                            <AiFillPhone />
                            <span>24/7 service</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Homepage2