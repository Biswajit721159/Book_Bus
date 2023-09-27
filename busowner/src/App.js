import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Bus_adder from "./component/Bus_adder";
import Navbar from './component/Navbar';
import Login from './component/Login'
import Register from './component/Register'
import Error from './component/Error'
import Home from "./component/Home";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/Bus_adder" element={<Bus_adder/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/Register" element={<Register/>}></Route>
        <Route path="*" element={<Error/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
