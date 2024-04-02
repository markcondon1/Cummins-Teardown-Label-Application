import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";


export default function Admin(){
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const deleteUser = ()=>{
        navigate('/app/admin/deleteUsers');
    }
    const addUser = ()=>{
        navigate('/app/admin/addUser');
    }
    const printer = ()=>{
        navigate('/app/admin/printerLogs');
    }
    return(
        <div>
            <div>
                <NavBar />
            </div>
           <Button onClick ={deleteUser}>Delete users</Button>
            <Button onClick ={addUser}> Add users</Button>
            <Button onClick ={printer}>View Printer Logs</Button>
        </div>
    )

}