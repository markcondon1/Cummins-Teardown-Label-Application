import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import placeholder_label from "./components/placeholder_label.png"
import {useSelector} from "react-redux";
import jsPDF from "jspdf";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";

export default function Reman(){
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const reman=()=>{
        navigate("/app/Reman");
    }
    const teardown = () => {
        navigate("/app/teardownTray");
    }

    const firstFit = () =>{
        navigate("/app/firstFit");
    }

    const handleReman = async () => {
        const item_segment1 = document.getElementById('item_segment1').value;
        try {
            const response = await fetch('http://localhost:8080/api/reman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item_segment1 }),
            });
            const data = await response.json();
            console.log(data);
            if(data.success)
            {
                printLabel(data);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };
   
       // data that will go inside the zebra printer language
       const printLabel = (data) => {
            //getting components for time and date
            const currentDate = new Date();
            const year = currentDate.getFullYear(); // Get the current year
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
            
            const date =`${month}/${day}/${year}`
            const time = `${hours}:${minutes}:${seconds}`;

            const matrixContent = `P${data.item_segment1}S${data.comp_serial_number}VTDRC`;

            // ZPL content for the label
            const zpl =``;

            // Create a new instance of jsPDF
            const doc = new jsPDF();
            // Add ZPL content to PDF
            doc.text(zpl, 10, 10);
            // Save PDF
            doc.save('label.pdf');
       }

    return(
        <div class="container-flex">
            <div>
                <NavBar></NavBar>
            </div>
            <div className="reman"> 
                <h1>Reman Teardown Print Label Station</h1>
                <div className="reman-container">
                    <label>Enter Part Number:</label>
                    <input type="text" id="item_segment1" placeholder="XXXXXX-RX" onSubmit={handleReman}></input>
                    <div className="reman-label-preview">
                        <label>Label Preview:</label>
                        <img src={placeholder_label} height={200} width={400}/>{''}
                        <Button>Print</Button>
                        </div>
                        
                    
                </div>
                
            </div>

        </div>
    )
}