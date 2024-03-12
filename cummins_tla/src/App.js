import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
//import logo from './logo.png';
import './App.css';

import Login from "./pages/login";
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
                  <Route exact path="/app" element={<ProtectedRoute><App/></ProtectedRoute>} />
                  <Route exact path="/app/home" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
                  <Route exact path="/app/firstFit" element={<ProtectedRoute><FirstFit/></ProtectedRoute>} />
                  <Route exact path="/app/Reman" element={<ProtectedRoute><Reman/></ProtectedRoute>} />
                  <Route exact path="/app/teardownTray" element={<ProtectedRoute><TeardownTray/></ProtectedRoute>} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
