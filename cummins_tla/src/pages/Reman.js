import React, { useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import RemanLabelPreview from "./components/RemanLabelPreview";
import placeholder_label from "./components/placeholder_label.png"
import {useSelector} from "react-redux";
import jsPDF from "jspdf";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";
import { useState } from "react";

export default function Reman(){
    //handles focusing input box
    const inputElement = useRef(null);
    useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

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

    const [data, setData] = useState({});

    const handleReman = async () => {
        let item_segment1 = document.getElementById("remanInput").value;
        try {
            const response = await fetch('http://localhost:8080/api/reman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({item_segment1}),
            });
            const temp = await response.json();
            console.log(temp);
            if(temp.success)
            {
                setData(temp.data);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };
   
       // data that will go inside the zebra printer language
       const printLabel = () => {
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

            const matrixContent = `P${data.ITEM_SEGMENT1}S${data.COMP_SERIAL_NUMBER}VTDRC`;

            // ZPL content for the label
            const zpl =
            `^XA

            ^FX Barcode and associated text
            ^FO40,0^ADN,30,20^BCN,30,Y,N,N,N^FD${data.ITEM_SEGMENT1}^FS
            
            ^FX Logo
            ^FO15,80^GFA,480,480,8,,L07JFE1FE,K07KFCC7E,J03LFC03E,J0LFC233E,I03KF7C187E,I07JFE3110FE,001KFEE18FFE,003LF91C7FE,007LF88DFFE,00LFC847FFE,01LF844IFE,01LF023IFE,03KFC613IFE,07KF831JFE,07JFE239JFE,0KFC71KFE,0KF638KFE,1JFE11BKFE,1JFC10LFE,3JF189LFE,3IFE1C7LFE,3IF98C6,3IF18F8,7FFD0C6,7FF88EC,7DFC47C,78CC278,60C62F8,61C71F8,47E0FF8,47F0FF8,478BFF8,410IFC,601IFE,703JF,3CKFC,3SFE,:1SFE,::0SFE,:07RFE,03RFE,:01RFE,00RFE,007QFE,003QFE,001QFE,I0QFE,I03PFE,I01PFE,J07OFE,K0OFE!K01NFEDM03LFC,,^FS
            
            ^FX Date/Time
            ^FO80,85^AFN,10,10^FD ${time}^FS
            ^FO80,120^AFN,10,10^FD ${date}^FS
            
            ^FX User ID
            ^FO250,95^ASN,1,1,^FD${user.userid}^FS
            
            ^FX Data matrix content text
            ^FO40,160^ADN,10,10^FD${matrixContent}^FS
            
            ^FX Data Matrix
            ^FO380,65^BXN,5,200,18,18,3,,1^FD${matrixContent}^FS
            
            ^XZ`;

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
                    <input ref={inputElement} type="text" placeholder="XXXXXX-RX" id="remanInput" onBlur={handleReman}></input>
                    <div className="reman-label-preview">
                        <label>Label Preview:</label>
                        <RemanLabelPreview> </RemanLabelPreview>
                        <Button onClick={printLabel}>Print</Button>
                        </div>
                        

                </div>
                
            </div>

        </div>
    )
}