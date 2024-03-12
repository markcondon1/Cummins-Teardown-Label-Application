import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
//import logo from './logo.png';
import './App.css';

import Login from "./pages/Login";
import FirstFit from "./pages/FirstFit";
import Reman from "./pages/Reman";
import TeardownTray from "./pages/TeardownTray";
import Dashboard from "./pages/Dashboard";
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import {userAuth} from "./store/actions/user";
import {useSelector} from "react-redux";

function App() {
    const userAuth = useSelector(state => state.user);

    console.log("user auth: ", userAuth.userAuth);
    const ProtectedRoute = ({children}) =>{
        if(!userAuth.userAuth){
            return <Navigate to="/"/>;
        }
        return children;
    };

  return (
      <div className="App">
          <Router>
              <Routes>
                  <Route exact path="/" element={<Login/>} />
                  <Route exact path="/app" element={<App/>} />
                  <Route exact path="/app/home" element={<Dashboard/>} />
                  <Route exact path="/app/firstFit" element={<FirstFit/> }/>
                  <Route exact path="/app/Reman" element={<Reman/>} />
                  <Route exact path="/app/teardownTray" element={<TeardownTray/>} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
