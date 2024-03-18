import React from "react";
import { Link } from 'react-router-dom'
const Homepage3 = () => {
    return (
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
                        <li><Link to="/checkstatus" style={{ textDecoration: 'none' }}>Check Status</Link></li>
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
    )
}
export default Homepage3