import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
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
        <div>
            <Button onClick={reman}> Reman </Button>
            <Button onClick={teardown}> Teardown Tray  </Button>
            <Button onClick={firstFit}> First Fit </Button>
        </div>
    )
}