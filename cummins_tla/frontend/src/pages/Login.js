import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import  './page_styles.css';
import logo from './components/logo.png';
import {useEffect, useState} from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {setUser, userAuth} from "../store/actions/user";
import {useDispatch, useSelector} from "react-redux";
import { apiWrapper } from "../apiWrapper";

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState(null);
    const user = useSelector(state => state.user);


    //handle login is an async function that takes in the inputted username and password
    //parses the values to ensure they match up with the users in the database
    // if they do the user is allowed to enter the system.
    const handleLogin = async () => {

        // Make an HTTP request to the login endpoint
        try {
            const data = await apiWrapper('api/login', 'POST', { username, password });
            console.log(data);
            if (data.success){
                dispatch(userAuth({
                    userAuth: true
                }))
            //dispatch to set user
                dispatch(setUser({
                    firstname: data.user.firstname,
                    lastname: data.user.lastname,
                    userid: data.user.userid,
                    admin: data.user.admin,
                }));
                console.log("first", data.user.firstname);
                console.log('User data dispatched:', user);
                navigate('/app/home');
            } else {
                dispatch(userAuth({
                    userAuth: false,
                }))
                setNotification('Incorrect username or password');
                setTimeout(() => setNotification(''), 5000);
            }
                } catch (error) {
            console.error('Error:', error);
            setNotification('An error occurred while logging in');
            setTimeout(() => setNotification(''), 5000);
        }
    };


    const fetchUserData = async () => {
        try {
            const data = await apiWrapper('api/data', 'GET');
            setUsers(data); // Set the users state with the fetched data
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
        console.log(users);
    }, [users]);


    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };


    return(
        <div className="login-container">

            <div className="login-header">
                <img src ={logo} alt="Logo" className="logo"/>
                <h1>Cummins Unified Teardown Label Application</h1>
            </div>

            <div className="login-form">
                <label htmlFor="userID">User ID</label>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    id="userID"
                    placeholder="Enter user ID"
                />

                <label htmlFor="password">Password</label>
                <div className="password-input-container" style={{ position: 'relative' }}>
                    <input
                        type={passwordShown ? "text" : "password"}
                        id="password"  
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Password"
                        style={{ paddingRight: '30px' }}
                    />
                    <button onClick={togglePasswordVisibility} style={{
                        position: 'absolute',
                        left: '150px',
                        top: '40%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'inherit',
                        padding: '0'
                    }}>
                        {passwordShown ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                    </button>
                </div>

                <Button onClick={handleLogin}>Login</Button>
                {notification && <div className="error-message">{notification}</div>}
            </div>
            <div className="user-list">
        </div>
            
        </div>
    )
}