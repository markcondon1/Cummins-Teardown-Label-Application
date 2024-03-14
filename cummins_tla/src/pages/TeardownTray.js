import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import jsPDF from "jspdf";
import {useState} from "react";
export default function TeardownTray() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [componentNumber, setComponentNumber] = useState('');
    const [componentDescription, setComponentDescription] = useState('');
    const [validInput, setValidInput] = useState(false);
    //getting components for time and date
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    let componentEntry ;


    const handleComponent = async (numberEntry)=>{
        try{
             const response = await fetch('http://localhost:8080/api/mesComponents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({componentNumber, componentDescription }),
            });
            const data = await response.json();
            data.rows.forEach(row => {
                if(numberEntry === row.COMPONENT_ITEM_NUMBER){
                    setComponentNumber(numberEntry);
                    setComponentDescription(row.COMPONENT_DESCRIPTION);
                    console.log("SUCCESS MOTHAFUCKA");
                    setValidInput(true);
                }else{
                  //  setValidInput(false);
                }
                // console.log('COMPONENT_ITEM_NUMBER:', row.COMPONENT_ITEM_NUMBER);
                // console.log('COMPONENT_DESCRIPTION:', row.COMPONENT_DESCRIPTION);

            });
            console.log("is input valid? ", validInput);
            console.log(data); // Handle the response from the server
        } catch (error) {
            console.error('Error:', error);

        }

    }

    const parts = componentDescription.split(' ');
    const name = parts[0];
    const restOfDescription = parts.slice(1).join(' ');



    console.log(`Current Date: ${year}-${month}-${day}`);
    console.log(`Current Time: ${hours}:${minutes}:${seconds}`);

    // const checkLabelNumber = (numberEntry,rows) => {
    //     rows.forEach(row => {
    //
    //        console.log('COMPONENT_ITEM_NUMBER:', row.COMPONENT_ITEM_NUMBER);
    //        // Process component number as needed
    // });
    // }

    // data that will go inside the zebra printer language
    const printLabel = () => {
        const date =`${month}/${day}/${year}`
        const time = `${hours}:${minutes}:${seconds}`;
        console.log(date, time);
        // ZPL content for the label
       const zpl =`^XA
^FO50,100^A0N,50,50^FB500,2,0,C^FD${componentNumber}^FS
^FO50,180^A0N,50,50^FB500,1,0,C^FD${name}^FS
^FO50,250^A0N,50,50^FB500,1,0,C^FD${restOfDescription}^FS
^FO50,340^A0N,50,50^FB500,2,0,C^FD${date} ${time}^FS
^XZ
`;

        // Create a new instance of jsPDF
        const doc = new jsPDF();
        // Add ZPL content to PDF
        doc.text(zpl, 10, 10);
        // Save PDF
        doc.save('label.pdf');
    }

    const reman = () => {
        navigate("/app/Reman");
    }

    const teardown = () => {
        navigate("/app/teardownTray");
    }

    const firstFit = () => {
        navigate("/app/firstFit");
    }

    return (
        <div class="container-flex">
            <div>
                <NavBar />
            </div>
            <div className="teardown">
                <h1>Teardown Tray Components Label Station</h1>
                <div className="teardown-container">
                    <label>Enter Value:</label>
                    <input type="text"
                           placeholder="Value"
                           onKeyDown={(e) => handleComponent(e.target.value)} />

                    <Button onClick={printLabel} disabled={!validInput}>print</Button>
                </div>


            </div>
        </div>
    );
}
