import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import RemanLabelPreview from "./components/RemanLabelPreview";
import placeholder_label from "./components/placeholder_label.png"
import {useSelector} from "react-redux";

export default function Reman(){
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
            <div className="reman"> 
                <h1>Reman Teardown Print Label Station</h1>
                <div className="reman-container">
                    <label>Enter Part Number:</label>
                    <input type="text" placeholder="XXXXXX-RX"></input>
                    <div className="reman-label-preview">
                        <label>Label Preview:</label>
                        <RemanLabelPreview> </RemanLabelPreview>
                        <Button>Print</Button>
                        </div>
                        
                    
                </div>
                
            </div>

        </div>
    )
}