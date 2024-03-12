import React from 'react';
import bus1 from '../images/bus-1.jpg';
import bus2 from '../images/bus-2.jpg'
import bus3 from '../images/bus-3.jpg'
import bus4 from '../images/bus-4.jpg'
import { Link } from 'react-router-dom'
import { AiFillCar, AiFillPhone, AiOutlineCheckCircle } from "react-icons/ai";


export default function FrontPage() {


    return (
        <div className='container-fluid mt-3'>



            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={bus3} className="d-block w-100" style={{ height: "400px", width: "140px" }} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src={bus2} className="d-block w-100" style={{ height: "400px", width: "140px" }} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src={bus1} className="d-block w-100" style={{ height: "400px", width: "140px" }} alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" style={{ backgroundColor: "black" }} aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" style={{ backgroundColor: "black" }} aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>





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


            <div className="container footer">
                <section className="mainfooter">
                    <div className="box-container">
                        <div className="box">
                            <h3>Locations</h3>
                            <li>India</li>
                            <li>Japan</li>
                            <li>Russia</li>
                            <li>USA</li>
                            <li>France</li>
                        </div>
                        <div className="box">
                            <h3>Quick Links</h3>
                            <li><Link to="/" style={{ textDecoration: 'none' }}>Home</Link></li>
                            <li><Link to="/BookBus" style={{ textDecoration: 'none' }}>Book Bus</Link></li>
                            <li><Link to="/checkstatus" style={{ textDecoration: 'none' }}>checkstatus</Link></li>
                            <li><a href='https://busowner.vercel.app/' style={{ textDecoration: 'none' }} target="_blank" >Bus Owner</a></li>
                            <li><a href='https://bus-booking-adminpanel.vercel.app/' style={{ textDecoration: 'none' }} target="_blank">adminpanel</a></li>
                        </div>
                        <div className="box">
                            <h3>Contact Info</h3>
                            <li>+123-456-7890</li>
                            <li>+111-222-3333</li>
                            <li>biswajit2329@gmail.com</li>
                            <li>biswajit@riktamtech.com</li>
                            <li>Hyderabad , india - 500016</li>
                        </div>
                        <div className="box">
                            <h3>Follow us</h3>
                            <li><a href="#" style={{ textDecoration: 'none' }}>facebook</a></li>
                            <li><a href="#" style={{ textDecoration: 'none' }}>twitter</a></li>
                            <li><a href="#" style={{ textDecoration: 'none' }}>instagram</a></li>
                            <li><a href="#" style={{ textDecoration: 'none' }}>linkedin</a></li>
                        </div>
                    </div>
                    <hr />
                    <div className="credit"> Copyright @ 2023 by <span>Mr Biswajit Ghosh</span> </div>
                </section>
            </div>
        </div>
    )
}