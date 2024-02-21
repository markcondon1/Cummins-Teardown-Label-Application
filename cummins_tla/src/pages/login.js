import {useNavigate} from "react-router-dom";

import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image';

//import logo from './logo.png';


export default function Login(){
    const navigate = useNavigate();
    const login =()=>{
        navigate('/app/home');
        console.log("test")
    }
    return(
        <div className="App">
            <div className="col-12 col-lg-6">
                <h1>Cummins Unified Teardown Label Application <Button>Logout</Button>{' '}</h1>
                <Button onClick={login}> login</Button>

            </div>
        </div>
    )
}