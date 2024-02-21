import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";

export default function FirstFit(){
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
        <div class="container">
            <div>
                <NavBar></NavBar>
                <div class="row">
            <div class="col">
        <h1>First Fit</h1>
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