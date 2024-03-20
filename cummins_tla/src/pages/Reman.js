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

    const [zpl, setZpl] = useState(null);
    const [notification, setNotification] = useState(null);

    const handleReman = async () => {
        const item_segment1 = document.getElementById("remanInput").value.toString();
        const validationRegex = /\A[1-9]{7,8}\-RX\Z/;
        if (validationRegex.test(item_segment1)){
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
                    generateLabel(temp.data);
                }
            } catch (error) {
                console.error('Error: ', error);
                setNotification('Internal server error');
                setTimeout(() => setNotification(''), 5000);
            }
        } else {
            setNotification('Invalid part number');
            setTimeout(() => setNotification(''), 5000);
        }
    };

    const generateLabel = (data) =>{
        //getting components for time and date
        const currentDate = new Date();
        const year = currentDate.getFullYear(); // Get the current year
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        
        const date =`${month}/${day}/${year}`;
        const time = `${hours}:${minutes}:${seconds}`;
       
        const twoDigitYear = year.toString().slice(-2);

        let start = new Date(currentDate.getFullYear(), 0, 0);
        let diff = (currentDate - start) + ((start.getTimezoneOffset() - currentDate.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let dayOfYear = Math.floor(diff / oneDay).toString().padStart(3,'0');

        const serial = handleSerial().toString().padStart(4,'0');

        const itemsegment = data.ITEM_SEGMENT1.toString().padStart(11,'0');

        const matrixContent = `P${itemsegment}S${twoDigitYear}${dayOfYear}${serial}V0TDRC`;
        //P0xxxxxxx-rxSYYJJJSSSSVTDRC

        // ZPL content for the label
        const zpl =
        `^XA
        ^FX Barcode and associated text
        ^FO40,0^ADN,30,20^BCN,30,Y,N,N,N
        ^FD${data.ITEM_SEGMENT1}^FS
        
        ^FX Logo
        ^FO15,80^GFA,480,480,8,,L07JFE1FE,K07KFCC7E,J03LFC03E,J0LFC233E,I03KF7C187E,I07JFE3110FE,001KFEE18FFE,003LF91C7FE,007LF88DFFE,00LFC847FFE, 01LF844IFE,01LF023IFE,03KFC613IFE,07KF831JFE,07JFE239JFE,0KFC71KFE,0KF638KFE,1JFE11BKFE,1JFC10LFE,3JF189LFE,3IFE1C7LFE,3IF98C6,3IF18F8,7FFD0C6,7FF88EC,7DFC47C,78CC278,60C62F8,61C71F8,47E0FF8,47F0FF8,478BFF8,410IFC,601IFE,703JF,3CKFC,3SFE,:1SFE,::0SFE,:07RFE,03RFE,:01RFE,00RFE,007QFE,003QFE,001QFE,I0QFE,I03PFE,I01PFE,J07OFE,K0OFE!K01NFEDM03LFC,,^FS
        
        ^FX Date/Time
        ^FO80,85^AFN,10,10^FD${time}^FS
        ^FO80,120^AFN,10,10^FD${date}^FS
        
        ^FX User ID
        ^FO250,95^ASN,1,1,^FD${user.userid}^FS
        
        ^FX Data matrix content text
        ^FO35,160^ADN,10,10
        ^FD${matrixContent}^FS
        
        ^FX Data Matrix
        ^FO380,65^BXN,5,200,20,20,3,,1
        ^FD${matrixContent}^FS
        ^XZ`;

        setZpl(zpl);

        requestLabelPreview(zpl);
    };

    async function requestLabelPreview(zpl){
        console.log(zpl);
        const dpmm = 8;
        const width = 2.5;
        const height = 1;
        try{
            const response = await fetch(`http://api.labelary.com/v1/printers/${dpmm}dpmm/labels/${width}x${height}/0/`,
            {
                method:"POST",
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(zpl),
            });
            const responseBlob = await response.blob();
            const imgsrc = URL.createObjectURL(responseBlob);
            document.getElementById("remanLabelPreview").setAttribute('src', imgsrc.toString());

        } catch (error) {
            console.error('Error: ', error);
            setNotification('Internal server error');
            setTimeout(() => setNotification(''), 5000);
        }   
    };

    const printLabel = () =>{
        if(zpl !== null)
        {
            setNotification('Printing unavailable.');
            setTimeout(() => setNotification(''), 5000);
        } else {
            setNotification('No label generated. Please try again.');
            setTimeout(() => setNotification(''), 5000);
        }
    };

    const handleSerial = () =>{
        const currentDate = new Date();
        if(localStorage.getItem('serialData') !== null){
            let serialData = JSON.parse(localStorage.getItem('serialData'));
            const localDate = new Date(serialData.date);
            if(localDate.getDate() === currentDate.getDate() && localDate.getMonth() === currentDate.getMonth()){
                serialData.serial += 1;
                localStorage.setItem('serialData', JSON.stringify(serialData))
                return JSON.parse(localStorage.getItem('serialData')).serial;
            } else{
                localStorage.removeItem('serialData');
                return createSerial();
            }
        } else{
            return createSerial();
        }
    };

    const createSerial = () =>{
        const currentDate = new Date();
        const serialData = {
            serial:1,
            date:currentDate,
        };
        localStorage.setItem('serialData', JSON.stringify(serialData))
        return JSON.parse(localStorage.getItem('serialData')).serial;
    };

    return(
        <div class="container-flex">
            <div>
                <NavBar></NavBar>
            </div>
            <div className="reman"> 
                <h1>Reman Teardown Print Label Station</h1>
                <div className="reman-container">
                    <label>Enter Part Number:</label>
                    <input ref={inputElement} type="text" placeholder="XXXXXX-RX" id="remanInput" onKeyDown={(e) => e.key === 'Enter' && handleReman()}></input>
                    {notification && <div className="error-message">{notification}</div>}
                    <div className="reman-label-preview">
                        <label>Label Preview:</label>
                        <img id="remanLabelPreview" src={placeholder_label} alt="label preview"></img>
                        <Button onClick={printLabel}>Print</Button>
                    </div>
                        

                </div>
                
            </div>

        </div>
    )
}