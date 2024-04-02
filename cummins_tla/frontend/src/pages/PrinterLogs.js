import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";


export default function PrinterLogs(){
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const getLogs = async () => {
        try{
            console.log("user id ", userId);
            const input = {item: userId};
            const logs = await apiWrapper('api/printLog', 'POST', {input});
            console.log("logs: ", logs);

        }catch (error) {
            console.error('Error:', error);
            ;
        }
    }
    getLogs();

    return(
        <div>
            <div>
                <NavBar />
            </div>

        </div>
    )

}