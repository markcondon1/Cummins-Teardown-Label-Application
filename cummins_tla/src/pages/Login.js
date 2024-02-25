import {useNavigate} from "react-router-dom";

import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image';
import  './page_styles.css';
import logo from './components/logo.png';
import {useEffect, useState} from "react";
import axios, {AxiosHeaders } from "axios";
import { supabase } from '../supabase';

export default function Login(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();
        // Make an HTTP request to the login endpoint
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log(data); // Handle the response from the server
            if (data.success){
                navigate('/app/home');
            } else {
                setNotification('Incorrect username or password');
                setTimeout(() => setNotification(''), 5000);
            }
                } catch (error) {
            console.error('Error:', error);
            setNotification('An error occurred while logging in');
            setTimeout(() => setNotification(''), 5000);
        }
    };
    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/data");
            const data = await response.json();
            setUsers(data); // Set the users state with the fetched data

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
        console.log(users);
    }, []);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(null);
    };


    return(
        <div className="login-container">

            <div className="login-header">
                <img src ={logo} alt="Logo" className="logo"/>
                <h1>Cummins Unified Teardown Label Application</h1>

            </div>
            <div className="login-form">
                <label htmlFor="userID">User ID</label>
                <input type="text"  value={username} onChange={(e) => setUsername(e.target.value)}id="userID" placeholder="Enter user ID" />

                <label htmlFor="password">Password</label>
                <input type="password" id="password"  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

                <Button onClick={handleLogin}>Login</Button>
                {notification && <div className="error-message">{notification}</div>}
            </div>
            <div className="user-list">
        </div>
            
        </div>
    )
}