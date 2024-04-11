import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import  './page_styles.css';


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
        <div className="container-flex">
            <NavBar />
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                </div>
                <div className="admin-button-container">
                    <button className="admin-button" onClick ={deleteUser}>Delete Users</button>
                    <button className="admin-button" onClick ={addUser}> Add Users</button>
                    <button className="admin-button" onClick ={printer}>View Printer Logs</button>
                </div>
            </div>
        </div>
    )

}