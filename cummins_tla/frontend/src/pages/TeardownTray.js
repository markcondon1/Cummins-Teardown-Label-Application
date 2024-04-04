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
    const [validInput, setValidInput] = useState(false);
    const [itemNum, setItemNum]=useState('');
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
    let componentEntry ;


    const handleComponent = async ()=>{
        try{
            const newVal = parseInt(myInput);
            console.log("input ", newVal);
            const input = {item: newVal};
            const data = await apiWrapper('api/teardowntray', 'POST', {newVal});
            const model = await apiWrapper('api/getModel', 'POST',{newVal});

            console.log("model ", model);
            console.log(typeof model);
            const modelArray = model.data;
            console.log(modelArray.MODEL_NUMBER);
            setModelType(modelArray.MODEL_NUMBER);


            console.log(typeof model);
            if (data.success) {
                console.log(data);
                console.log(typeof data);
                const dataArray = data.data;

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

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        // Allow only numbers and limit length to 7
        if (/^\d{0,7}$/.test(inputValue)) {
            setComponentNumber(inputValue);
            if (inputValue.length === 7) {
                handleComponent(inputValue);
            }
        }
    };   

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
