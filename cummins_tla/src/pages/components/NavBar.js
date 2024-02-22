import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { slide as Menu } from 'react-burger-menu'
import logo from './logo.png';
import '../../App.css';

function NavBar(){
    const navigate = useNavigate();

    const logout=()=>{
        navigate("/");
    }
    return (
        <Navbar id="navbar" bg="primary" data-bs-theme="dark">
        <Container>
          
          <Navbar.Brand href="">
            <img src={logo} height={60} width={60}/>{''}
            Cummins Unified Teardown Label Application
          </Navbar.Brand>
          <Button class="btn btn-secondary" onClick={logout} >Logout</Button>
        </Container>
      </Navbar>
    )
}

export default NavBar;