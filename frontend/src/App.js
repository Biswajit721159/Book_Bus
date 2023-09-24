import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './component/Navbar';
import Home from "./component/Home";
import Register from "./User/Register";
import Login from "./User/Login";
import Bus_adder from "./component/Bus_adder";
import MasterList from "./component/MasterList";
import Ticket_Book from "./component/Ticket_Book";
import LastTransaction from "./component/LastTransaction";
import WishList from "./component/WishList";
import CheckStatus from "./component/CheckStatus";
import Error from "./component/Error";
import View_Ticket from "./component/View_Ticket";
import View_Bus from "./component/View_Bus";
import FrontPage from "./component/FrontPage"

function App() {
  return (
    <div>
      <Router>
        <Navbar/>
          <Routes>
            <Route path="/FrontPage" element={<FrontPage/>}></Route>
            <Route path="/" element={<Home/>}></Route>
            <Route path="Register" element={<Register/>}></Route>
            <Route path="Login" element={<Login/>}></Route>
            <Route path="Bus_adder" element={<Bus_adder/>}></Route>
            <Route path="MasterList" element={<MasterList/>}></Route>
            <Route path="LastTransaction" element={<LastTransaction/>}></Route>
            <Route path="WishList" element={<WishList/>}></Route>
            <Route path="checkstatus" element={<CheckStatus/>}></Route>
            <Route path="/:bus_id/:src/:dist/:date" element={<Ticket_Book/>}></Route>
            <Route path="/:_id" element={<View_Ticket/>}></Route>
            <Route path="/View_Bus/:_id" element={<View_Bus/>}></Route>
            <Route path="*" element={<Error/>}></Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;