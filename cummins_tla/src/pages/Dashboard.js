import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../App.css';
export default function Dashboard(){
    const navigate = useNavigate();

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
        
        <div class="container" className="Dashboard">
            <div className="Dashboard">
            <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Cummins Unified Teardown Label Application
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div class="row">
            <div class="col">
        <h1>Click which label you would like to print.</h1>
        <div class="col">
            <Button id = "Dashboard-btn"onClick={firstFit}>  First Fit  </Button>
            </div>
        <div class="col">
            <Button id = "Dashboard-btn"onClick={teardown}> Teardown Tray  </Button>
            </div>
            <Button id = "Dashboard-btn" onClick={reman}> Reman </Button>
        </div>
            </div>
        </div>
        </div>
        
    )
}