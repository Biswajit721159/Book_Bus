import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './component/Navbar'
import Home from './component/Home'
import Login from './component/Login'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route>
          <Route path='/' element={<Home/>}></Route>
          <Route path="/Login" element={<Login/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
