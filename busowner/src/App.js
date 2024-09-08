import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Bus_adder from "./component/Bus_adder";
import Navbar from './component/Navbar';
import Login from './component/Login'
import Register from './component/Register'
import Error from './component/Error'
import SuperAdminpanel from './component/SuperAdminpanel'
import Home from "./component/Home";
import View_Bus from "./component/View_Bus"
import ViewSeat from "./component/ViewSeat"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { FullPageLoader } from "./component/FullPageLoader";
import { logInByToken } from "./utilities/authApi";
import { useSelector, useDispatch } from "react-redux";
import { usermethod } from "./redux/userSlice";

function App() {
  const [load, setLoad] = useState(false);
  const userinfo = useSelector((state) => state.userAuth.user);
  const dispatch = useDispatch();


  useEffect(() => {
    if (userinfo?.auth) loadUser();
  }, []);


  async function loadUser() {
    try {
      setLoad(true);
      let response = await logInByToken(userinfo?.auth);
      if (response?.statusCode !== 200) {
        dispatch(usermethod.Logout_User());
        toast.warn("user logout")
      } else if (response?.statusCode === 200) {
        dispatch(usermethod.setUserInfo(response.data))
      }
      setLoad(false);
    } catch (e) {
      toast.warn(e.message);
      setLoad(false);
    }
  }
  return (
    <>
      {!load ? <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/BusAdder" element={<Bus_adder />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/View_Bus/:_id" element={<View_Bus />}></Route>
          <Route path="*" element={<Error />}></Route>
          <Route path="/ViewSeat" element={<ViewSeat />}></Route>
          <Route path="/SuperAdmin" element={<SuperAdminpanel />}></Route>
        </Routes>
      </Router> :
        <FullPageLoader open={load} />}
      <ToastContainer theme="light" />
    </>
  );
}

export default App;
