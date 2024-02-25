import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import placeholder_label from "./components/placeholder_label.png"

export default function Reman(){
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
                        <img src={placeholder_label} height={200} width={400}/>{''}
                        <Button>Print</Button>
                        </div>
                        
                    
                </div>
                
            </div>

        </div>
    )
}