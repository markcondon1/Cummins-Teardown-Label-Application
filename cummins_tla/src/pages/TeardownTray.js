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
    const [itemNum, setItemNum]=useState('');
    const [modelType, setModelType] = useState('');
    //getting components for time and date
    const currentDate = new Date();

    const year = currentDate.getFullYear(); // Get the current year
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
                    setItemNum(row.ID21_ITEM_NUMBER);
                    console.log("SUCCESS ", itemNum, componentDescription);
                    setValidInput(true);
                }else{
                      setValidInput(false);
                }

            });
            // console.log("is input valid? ", validInput);
            // console.log("SUCCESS ", );

        } catch (error) {
            console.error('Error:', error);

        }

    }

    const modelPull = async ()=>{
        try{
            const response = await fetch('http://localhost:8080/api/modelNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({componentNumber, componentDescription }),
            });
            const data = await response.json();
            console.log("nums ", data);
            data.rows.forEach(row => {
                if(itemNum === row.ID21_ITEM_NUMBER){
                    setModelType(row.MODEL_NUMBER);
                    //this should work if the ID21's in the databases matchup, but
                    //for now the dummy data given is insufficient, so hardcoding
               }
            });
            console.log("is input valid? ", validInput);
        } catch (error) {
            console.error('Error:', error);

        }
    }



    // const parts = componentDescription.split(' ');
    // const name = parts[0];
    // const restOfDescription = parts.slice(1).join(' ');


    // data that will go inside the zebra printer language
    const printLabel = () => {
        const date =`${month}/${day}/${year}`
        const time = `${hours}:${minutes}:${seconds}`;
        console.log(date, time);
        // ZPL content for the label
        const model = 'HE341Ve';
        //REPLACE: the hardcoded string model for 'modelType' when database correct
        const zpl =` ^XA
^FO20,50^A0N,30,30^FB500,2,0,C^FD${componentNumber}^FS
^FO20,100^A0N,30,30^FB500,1,0,C^FD${componentDescription}^FS
^FO20,150^A0N,30,30^FB500,1,0,C^FD${model}^FS

^FO20,200^A0N,30,30^FB500,2,0,C^FD${date} ${time}^FS
^XZ`;

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
                <h1 className="teardown-header">Teardown Tray Components Label Station</h1>
                <div className="teardown-container">
                    <label>Enter Value:</label>
                    <input type="text"
                           placeholder="Value"
                           onKeyDown={(e) => handleComponent(e.target.value)} />

                    <Button onClick={printLabel}>print</Button>

                </div>
                {/* Button to generate and download PDF */}

            </div>
        </div>
    );
}
