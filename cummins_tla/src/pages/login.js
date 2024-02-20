import Button from 'react-bootstrap/Button';
import useNavigation from 'react-router-dom';


export default function login(){
    const navigate = useNavigate();

    const login =() =>{

        navigate("/")
    }

    return(
        <div>
            <Button> Login </Button>
        </div>

    )
}