import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavBar from "./components/NavBar";
import '../App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";
export default function Dashboard(){
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    console.log("user: ", user);
    const reman=()=>{
        navigate("/app/Reman");
    }
    const teardown = () => {
        navigate("/app/teardownTray");
    }

    const firstFit = () =>{
        navigate("/app/firstFit");
    }


    return(
    
    <div class="container-flex">
            <NavBar></NavBar>     
            <div className="dashboard-container">
                <div className="dashboard">
                    <h1>Click which label you would like to print.</h1>
                        <Button onClick={firstFit}>  First Fit  </Button>
                        <Button onClick={teardown}> Teardown Tray  </Button>
                        <Button onClick={reman}> Reman </Button>
                    </div>
                </div>
            </div>

        
    )
}