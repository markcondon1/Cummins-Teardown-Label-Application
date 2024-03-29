import {useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { slide as Menu } from 'react-burger-menu';
import logo from './logo.png';
import { FaUser } from "react-icons/fa";
import './NavBar.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


function NavBar(){
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const location = useLocation();
    const user = useSelector(state => state.user);
    const [firstname, setFirstname] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [username, setUsername] = useState('');


    useEffect(() => {
        // const fetchUserData = async () => {
        //
        //     try {
        //         const response = await fetch('http://localhost:8080/api/login', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({ username, firstname,lastname }),
        //         });
        //         const data = await response.json();
        //         console.log(data);
        //     } catch (error) {
        //         console.error('Error fetching user data:', error);
        //     }
        // };

        //fetchUserData();
        console.log("user: ", user);
    }, []);

    const logout=()=>{
        navigate("/");
    }
    const reman=()=>{
        navigate("/app/Reman");
    }
    const teardown = () => {
        navigate("/app/teardownTray");
    }

    const firstFit = () =>{
        navigate("/app/firstFit");
    }
    return (
      
        <Navbar id="navbar" bg="primary" data-bs-theme="dark">

        <Menu>
          <Button id="first-fit" variant= "link" className="menu-item" onClick={firstFit}>First Fit</Button>
          <Button id="teardown-tray" variant= "link" className="menu-item" onClick={teardown}>Teardown Tray</Button>
          <Button id="reman" variant= "link" className="menu-item" onClick={reman}>Reman</Button>
        </Menu>
        <Container>
          <Navbar.Brand href="">
            <img src={logo} height={60} width={60}/>{''}
            
          </Navbar.Brand>
          <p className="title">Cummins Unified Teardown Label Application</p>
          
          <div className="user-id">
              <h6> {user.lastname}, {user.firstname} [{user.userid}]</h6>
          </div>

          <Button className="logout-button" onClick={logout} >Logout</Button>
        </Container>
      </Navbar>
    )
}

export default NavBar;