import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";

export default function TeardownTray(){
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
        <div class="container-fluid">
            <div>
                <NavBar></NavBar>
            </div>
            <h1>Teardown Tray Components Label Station</h1>
        </div>
    )
}