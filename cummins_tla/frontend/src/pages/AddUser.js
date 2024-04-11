import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import './page_styles.css';


export default function AddUser(){
    const [userid, setUserId] = useState('');
    const navigate = useNavigate();
    const [firstname, setFirstname] =useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword]= useState('');

    const handleCreate = async () => {
        try{
            console.log("user id ", userid);
            //const input = {item: userId};
            const deleteUser = await apiWrapper('api/addUser', 'POST', {userid,firstname,lastname,password});


        }catch (error) {
            console.error('Error:', error);
            ;
        }
    }

    return(
        <div className="container-flex">
            <NavBar />
            <div className="add-user-container">
                <div className="add-user-form">
                    <div className="add-user-header">
                        <h1>Add User</h1>
                    </div>
                    <input
                        type="text"
                        value={userid}
                        onChange={(e) => setUserId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        id="userID"
                        placeholder="user ID"
                    />
                    <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        id="userID"
                        placeholder="first name"
                    />
                    <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        id="userID"
                        placeholder="last name"
                    />
                    <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    id="userID"
                    placeholder="enter password"
                    />
                    <div className="admin-checkbox">
                        <input type="checkbox" id="adminPermission" />
                        <label htmlFor="adminPermission">Administrator</label>
                    </div>
                    <Button onClick={handleCreate} className="add-user-button">Add User</Button>
                </div>
            </div>
        </div>
    )

}