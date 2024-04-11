import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import jsPDF from "jspdf";
import {useEffect, useState} from "react";
import { apiWrapper } from "../apiWrapper";
export default function TeardownTray() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [componentNumber, setComponentNumber] = useState('');
    const [componentDescription, setComponentDescription] = useState('');

    const [modelType, setModelType] = useState('');
    const [myInput, setMyInput] = useState('');
    //getting components for time and date
    const currentDate = new Date();

    const year = currentDate.getFullYear(); // Get the current year
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    useEffect(() => {
        if (componentNumber.length === 7) {
            handleComponent();
        }
    }, [componentNumber]);

    useEffect(() => {
        if (componentDescription) {
            printLabel();
        }
    }, [componentDescription]);

//weh

    //handle component is an async function that takes in the input value and from the input
    //parses the component item number and description from the mes bom compenents database.
    // it then uses the component number to connect to the mes wip info table to access the componenets
    //model number
    const handleComponent = async ()=>{
        try{
            const newVal = parseInt(componentNumber);
            console.log("input ", newVal);
            const input = {item: newVal};
            //call backend function
            const data = await apiWrapper('api/teardowntray', 'POST', {newVal});
            //call model backend function
            const model = await apiWrapper('api/getModel', 'POST',{newVal});

            if (data.success && model.success) {
                const dataArray = data.data;
                const modelArray = model.data;
                console.log("model ", modelArray.MODEL_NUMBER);
                setModelType(modelArray.MODEL_NUMBER);
                setComponentNumber(dataArray[0].COMPONENT_ITEM_NUMBER);
                setComponentDescription(dataArray[0].COMPONENT_DESCRIPTION);

            }else{
                console.log("fail");

            }

        } catch (error) {
            console.error('Error:', error);
        }
    }


    useEffect(() => {
        if(componentDescription) {
            printLabel();
        }
    }, [componentDescription]);

    // data that will go inside the zebra printer language
    const printLabel = () => {
        const date =`${month}/${day}/${year}`
        const time = `${hours}:${minutes}:${seconds}`;
        console.log(date, time);

        // ZPL content for the label

        const zpl =` ^^XA
            ^FO20,50^A0N,28,28^FB500,2,0,C^FD${componentNumber}^FS
            ^FO20,80^A0N,24,24^FB500,1,0,C^FD${componentDescription}^FS
            ^FO20,110^A0N,24,24^FB500,1,0,C^FD${modelType}^FS
            ^FO20,140^A0N,24,24^FB500,2,0,C^FD${date} ${time}^FS
            ^XZ`;

        // Create a new instance of jsPDF
        const doc = new jsPDF();
        // Add ZPL content to PDF
        doc.text(zpl, 10, 10);
        // Save PDF
        doc.save('teardown_label.pdf');
    }

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        // Allow only numbers and limit length to 7
        if (/^\d{0,7}$/.test(inputValue)) {
            setComponentNumber(inputValue);
        }
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
                           value={componentNumber}
                           onChange={handleInputChange}
                           
                    />
                </div>
            </div>
        </div>
    );
}
