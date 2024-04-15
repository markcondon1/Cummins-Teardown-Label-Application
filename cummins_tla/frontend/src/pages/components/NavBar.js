import {useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { slide as Menu } from 'react-burger-menu';
import logo from './logo.png';
import { FaUser } from "react-icons/fa";
import './NavBar.css';
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";


function NavBar(){
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const[isAdmin, setIsAdmin] = useState('');

    //checks user's admin permissions, if true, shows admin on hamburger menu
    useEffect(() => {
        setIsAdmin(user.admin);
    }, []);

    //handles navigation for navbar
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

    const admin = ()=>{
        navigate("/app/admin");
    }
    return (
      
        <Navbar id="navbar" bg="primary" data-bs-theme="dark">
        <Menu>
          <Button id="first-fit" variant= "link" className="menu-item" onClick={firstFit}>First Fit</Button>
          <Button id="teardown-tray" variant= "link" className="menu-item" onClick={teardown}>Teardown Tray</Button>
          <Button id="reman" variant= "link" className="menu-item" onClick={reman}>Reman</Button>
            {isAdmin && (
          <Button id="admin" variant="link" className="menu-item" onClick={admin}>Admin</Button>
            )}
        </Menu>
        
        <Container>
          <Navbar.Brand href="">
            <img src={logo} height={60} width={60}/>{''}
          </Navbar.Brand>
          <p className="title">Cummins Unified Teardown Label Application</p>
          <FaUser />
          <div className="user-id">
              <h6> {user.lastname}, {user.firstname} [{user.userid}]</h6>
          </div>
          
          <Button className="logout-button" onClick={logout} >Logout</Button>
        </Container>
      </Navbar>
    )
}

export default NavBar;