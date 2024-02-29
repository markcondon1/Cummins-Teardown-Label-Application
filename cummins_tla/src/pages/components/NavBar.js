import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { slide as Menu } from 'react-burger-menu';
import logo from './logo.png';
import './NavBar.css';
import {useEffect, useState} from "react";
import axios from "axios";

function NavBar(){
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Make an API call to fetch user information after successful login
        const fetchUserData = async () => {
            try {
                // Replace 'api/userdata' with the appropriate API endpoint to fetch user data
                const response = await axios.get('http://localhost:8080/api/login', {
                    username: 'example_username',
                    password: 'example_password'
                });
                setUserInfo(response.data.user); // Assuming response.data contains user information
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const logout=()=>{
        navigate("/");
    }
    return (
      
        <Navbar id="navbar" bg="primary" data-bs-theme="dark">
            {userInfo && (
                <div>
                    <p>First Name: {userInfo.firstname}</p>
                    <p>Last Name: {userInfo.lastname}</p>
                    <p>User ID: {userInfo.userid}</p>
                </div>
            )}
        <Menu>
          <a id="first-fit" className="menu-item" href="/app/firstFit">First Fit</a>
          <a id="teardown-tray" className="menu-item" href="/app/teardownTray">Teardown Tray</a>
          <a id="reman" className="menu-item" href="/app/Reman">Reman</a>
        </Menu>
        <Container>
          <Navbar.Brand href="">
            <img src={logo} height={60} width={60}/>{''}
            Cummins Unified Teardown Label Application
          </Navbar.Brand>
          <div className="user-id">
              {userInfo && (
                  <div className="user-info">
                      <p>First Name: {userInfo.firstname}</p>
                      <p>Last Name: {userInfo.lastname}</p>
                      <p>User ID: {userInfo.userid}</p>
                  </div>
              )}
          </div>
          <Button onClick={logout} >Logout</Button>
        </Container>
      </Navbar>
    )
}

export default NavBar;