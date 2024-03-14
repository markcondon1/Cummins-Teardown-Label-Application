import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import jsPDF from "jspdf";
export default function TeardownTray() {
    //handles focusing input box
    const inputElement = useRef(null);
    useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);



    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    //getting components for time and date
    const currentDate = new Date();

    const year = currentDate.getFullYear(); // Get the current year
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');


    console.log(`Current Date: ${year}-${month}-${day}`);
    console.log(`Current Time: ${hours}:${minutes}:${seconds}`);

    // data that will go inside the zebra printer language
    const printLabel = () => {
        const date =`${month}/${day}/${year}`
        const time = `${hours}:${minutes}:${seconds}`;
        console.log(date, time);
        // ZPL content for the label
       const zpl =`^XA
^FO50,100^A0N,50,50^FB500,2,0,C^FD4040880^FS
^FO50,180^A0N,50,50^FB500,1,0,C^FDShaft&Wheel^FS
^FO50,250^A0N,50,50^FB500,1,0,C^FDHE451Ve^FS
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
                    <input ref={inputElement} type="text" placeholder="Value" />

                    <Button onClick={printLabel}>print</Button>
                </div>
                {/* Button to generate and download PDF */}

            </div>
        </div>
    );
}
