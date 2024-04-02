import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";


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
        <div>
            <div>
                <NavBar />
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
        </div>
    )

}