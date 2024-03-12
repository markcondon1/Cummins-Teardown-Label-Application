import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import {useSelector} from "react-redux";

export default function TeardownTray(){
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
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
            <div>
                <NavBar></NavBar>
            </div>
            <div className="teardown">
            <h1>Teardown Tray Components Label Station</h1>
                <div className="teardown-container">
                    <label>Enter Value:</label>
                    <input type="text" placeholder="Value"></input>
                </div>
            </div>
        </div>
    )
}