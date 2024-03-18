import React from "react";
import bus1 from '../images/bus-1.jpg';
import bus2 from '../images/bus-2.jpg'
import bus3 from '../images/bus-3.jpg'
const Homepage1 = () => {
    return (
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
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon" style={{ backgroundColor: "black" }} aria-hidden="true"></span>
            </button>
        </div>
    )
}

export default Homepage1