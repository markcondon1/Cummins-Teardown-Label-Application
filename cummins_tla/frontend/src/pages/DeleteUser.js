import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useState} from "react";
import NavBar from "./components/NavBar";
import './page_styles.css';


export default function Admin(){
    const [userId, setUserId] = useState('');

    //handle delete deletes a user from the database table when a user inputs a user's id.
    const handleDelete = async () => {
        try{
            console.log("user id ", userId);
            const input = {item: userId};
            //call to the backend delete query
            const deleteUser = await apiWrapper('api/deleteUser', 'POST', {input});


        }catch (error) {
            console.error('Error:', error);
            ;
        }
    }

    return(
        <div class="container-flex">
            <NavBar />
            <div className="delete-user-container">
                <div className="delete-user-form">
                    <div className="delete-user-header">
                        <h1>Delete User</h1>
                    </div>
                    <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                    id="userID"
                    placeholder="Enter user ID"
                    />
                    <Button onClick={handleDelete} className="delete-user-button">Delete User</Button>
                </div>
            </div>
        </div>
    )

}