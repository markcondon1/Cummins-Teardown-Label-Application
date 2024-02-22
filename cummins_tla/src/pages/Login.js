import {useNavigate} from "react-router-dom";

import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image';
import './page_styles.css';

import logo from './components/logo.png';


export default function Login(){
    const navigate = useNavigate();
    const login =()=>{
        navigate('/app/home');
        console.log("test")
    }
    return(
        <div className="login-container">
            <div className="login-header">
                <img src ={logo} alt="Logo" className="logo"/>
                <h1>Cummins Unified Teardown Label Application</h1>
    
            </div>
            <div className="login-form">
                <label htmlFor="userID">User ID</label>
                <input type="text" id="userID" placeholder="Enter user ID" />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Password" />

                <Button onClick={login}>Login</Button>
            </div>
            
        </div>
    )
}