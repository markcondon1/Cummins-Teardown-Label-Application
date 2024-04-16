import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import NavBar from "./components/NavBar";
import './page_styles.css';


export default function AddUser(){
    const [userid, setUserId] = useState('');
    const [firstname, setFirstname] =useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword]= useState('');
    const [isAdmin, setIsAdmin] =useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // this function handles creating a new user based off the input from the text boxes
    //and adds the new user to the database

    const handleCheckboxChange = (event) => {
        setIsAdmin(event.target.checked);
    };

    const handleCreate = async () => {
        setMessage('');
        setError('')
        try{
            console.log("user id ", userid);
            //call to the backend that create a new user based off the specific inputs
            const response= await apiWrapper('api/addUser', 'POST', {userid,firstname,lastname,password, isAdmin});
            if(response.success){
                setMessage('User added successfully!');
            }else{
                setError('Failed to add user. Please try again.');
            }

            setTimeout(() => setMessage(''), 7000);
            setUserId('');
            setFirstname('');
            setLastname('');
            setPassword('');
        }catch (error) {
            console.error('Error:', error);
            setError('Failed to add user. Please try again.');
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
                        <input type="checkbox"
                               id="adminPermission"
                               checked={isAdmin}
                               onChange={handleCheckboxChange}
                        />
                        <label htmlFor="adminPermission">Administrator</label>
                    </div>
                    <Button onClick={handleCreate} className="add-user-button">Add User</Button>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                </div>
            </div>
        </div>
    )

}