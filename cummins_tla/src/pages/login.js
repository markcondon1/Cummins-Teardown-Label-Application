import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.png';
import {useNavigate} from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const login =()=>{
        navigate('/home');
    }
    return(
        <div className="row">
            <div className="col-12 col-lg-6">
                <h1><img src={logo} width={75} height={75}/>Cummins Unified Teardown Label
                    Application <Button>Logout</Button>{' '}</h1>

            </div>
        </div>
    )
}