import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loadBus, fetchBusData } from '../redux/BusSlice'
import { BusSearchmethod } from '../redux/BusSearchSlice'
const api = process.env.REACT_APP_API

const Searching = () => {

    let src = useSelector((state) => state.BusSearch.src);
    let dist = useSelector((state) => state.BusSearch.dist);
    let date = useSelector((state) => state.BusSearch.date)
    const [disabled, setdisabled] = useState(false)

    const dispatch = useDispatch();
    const { Bus, station, loadingBus, loadingStation, error } = useSelector(state => state.Bus);


    const [erroInSrc, seterroInSrc] = useState(false)
    const [messerroInSrc, setmesserroInSrc] = useState("")

    const [errordist, seterrordist] = useState(false)
    const [messerrordist, setmesserrordist] = useState("")

    const [errordate, seterrordate] = useState(false)
    const [messerrordate, setmesserrordate] = useState("")

    function FindError() {
        let x = true
        if (src == "Select Your Source Station" || src.length == 0) {
            seterroInSrc(true)
            setmesserroInSrc("*Select A Station")
            x = false
        }
        if (dist == "Select Your Source Station" || dist.length == 0) {
            seterrordist(true)
            setmesserrordist("*Select A Station")
            x = false
        }
        if (date.length == 0) {
            seterrordate(true)
            setmesserrordate("*Select A Date")
            x = false
        }
        return x;
    }

    function Findbus() {
        let ans = FindError();
        if (ans == true) {
            seterroInSrc(false)
            seterrordist(false)
            seterrordate(false)
            setdisabled(true)
            dispatch(fetchBusData({ src, dist }))
            setdisabled(false)
        }
    }

    const minDate = () => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); Findbus() }}>
            <div className="d-flex align-items-center justify-content-center mt-4">
                <div className="d-flex ">
                    <select className="form-select" aria-label="Default select example" value={src} required onChange={(e) => { dispatch(BusSearchmethod.Addsrc(e.target.value)) }} style={{ backgroundColor: "#7DBCFA" }}>
                        <option style={{ textAlign: "center" }} value='' selected>Select Your Source Station</option>
                        {
                            station.map((item, ind) => (
                                <option key={ind} style={{ textAlign: "center" }} >{item}</option>
                            ))
                        }
                    </select>
                    {erroInSrc ? <label className="mt-0" style={{ color: "red" }}>{messerroInSrc}</label> : ""}
                </div>
                <div className="d-flex ">
                    <i className="fa fa-arrow-circle-right d-flex justify-content-center mx-2 my-2" style={{ fontSize: "38px", color: "green", textAlign: "center" }}></i>
                </div>
                <div className="d-flex ">
                    <select className="form-select" aria-label="Default select example" value={dist} required onChange={(e) => { dispatch(BusSearchmethod.adddist(e.target.value)) }} style={{ backgroundColor: "#7DBCFA" }}>
                        <option style={{ textAlign: "center" }} value='' selected>Select Your Distination Station</option>
                        {
                            station.map((item, ind) => (
                                <option key={ind} style={{ textAlign: "center" }} >{item}</option>
                            ))
                        }
                    </select>
                    {errordist ? <label className="mt-0" style={{ color: "red" }}>{messerrordist}</label> : ""}
                </div>
                <div className="d-flex mx-1">
                    <div className="input-group date" id="datepicker">
                        <input type="date" className="form-control" value={date} min={minDate()} onChange={(e) => { dispatch(BusSearchmethod.addate(e.target.value)) }} style={{ backgroundColor: "#7DBCFA" }} required id="date" />
                    </div>
                    {errordate ? <label className="mt-0" style={{ color: "red" }}>{messerrordate}</label> : ""}
                </div>
                <div className="d-flex d-flex justify-content-center mx-1">
                    <button type="submit" className="btn btn-success btn-sm" disabled={disabled} >Find Bus</button>
                    {(src?.length && dist?.length && date?.length) ? <button type="submit" onClick={() => {
                        dispatch(BusSearchmethod.clearsearch())
                        dispatch(loadBus())
                    }} className="btn btn-danger mx-2 btn-sm">clear</button> : ""}
                </div>
            </div>
        </form>
    )
}
export default Searching