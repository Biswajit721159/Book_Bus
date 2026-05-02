import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Bus_adder from "./component/Bus_adder";
import Navbar from './component/Navbar';
import Login from './component/Login';
import Register from './component/Register';
import Error from './component/Error';
import SuperAdminpanel from './component/SuperAdminpanel';
import Adminpanel from "./component/Adminpanel";
import View_Bus from "./component/View_Bus";
import ViewSeat from "./component/ViewSeat";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { FullPageLoader } from "./component/FullPageLoader";
import { logInByToken } from "./utilities/authApi";
import { useSelector, useDispatch } from "react-redux";
import { usermethod } from "./redux/userSlice";
import WelcomePage from "./component/WelcomePage";
import EditBus from "./component/EditBus";
import Booking from "./component/Booking";
import UserTable from "./ManageUser/UserTable";

function App() {
  const [load, setLoad] = useState(false);
  const userinfo = useSelector((state) => state.userAuth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userinfo?.auth) loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUser() {
    try {
      setLoad(true);
      const response = await logInByToken(userinfo?.auth);
      if (response?.statusCode !== 200) {
        dispatch(usermethod.Logout_User());
        toast.warn("Session expired. Please log in again.");
      } else if (response?.statusCode === 200) {
        dispatch(usermethod.setUserInfo(response.data));
      }
    } catch (e) {
      toast.warn(e.message);
    } finally {
      setLoad(false);
    }
  }

  if (load) return <FullPageLoader open={true} />;

  return (
    <Router>
      <div className="min-h-screen bg-surface-secondary flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/Adminpanel" element={<Adminpanel />} />
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Route path="/BusAdder" element={<Bus_adder />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Route path="/View_Bus/:_id" element={<View_Bus />} />
            <Route path="/ViewSeat" element={<ViewSeat />} />
            <Route path="/SuperAdminpanel" element={<SuperAdminpanel />} />
            <Route path="/EditBus" element={<EditBus />} />
            <Route path="/Booking" element={<Booking />} />
            <Route path="/ManageUser" element={<UserTable />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
