import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import  './page_styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from "jspdf";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";

export default function FirstFit(){

    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    console.log("user: ", user);

    var compressorBool = false;
    var turbineBool = false;

    console.log(compressorBool);

    const printLabel = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear(); // Get the current year
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        let start = new Date(currentDate.getFullYear(), 0, 0);
        let diff = (currentDate - start) + ((start.getTimezoneOffset() - currentDate.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let dayOfYear = Math.floor(diff / oneDay).toString().padStart(3,'0');
        
        const date =`${month}/${day}/${year}`;
        const time = `${hours}:${minutes}:${seconds}`;

        const twoDigitYear = year.toString().slice(-2);

        const serial = handleSerial().toString().padStart(4,'0');

        console.log("compressor "+compressorBool);
        if(turbineBool = true)
        {
            const itemsegment = ``;

        const matrixContent = `P${itemsegment}S${twoDigitYear}${dayOfYear}${serial}V0TDRC`;
            const zpl = `
            ^XA
            ^FX Date/Time
            ^FO5,25^A 0,30,30^FD ${time}^FS
            ^FO125,25^A 0,30,30^FD ${date}^FS
                
            ^FX User ID
            ^FO310,25^A 0,30,30^FD${user.userid}^FS
        
            ^FX Turbine/Compressor Housing
            ^FO5,55^A 0,30,30^FD Turbine Housing:^FS
            ^FO310,55^A 0,30,30^FD3592787^FS
        
            ^FX TD SQ
            ^FO5,85^A 0,30,30^FD TD SEQ:^FS
            ^FO310,85^A 0,30,30^FD2402070053 ^FS
        
            ^FO180,145^BXN,5,200,20,20,3,,1
                ^FD${matrixContent}^FS
        
            ^XZ 
            `;
            // Create a new instance of jsPDF
            const doc = new jsPDF();
            // Add ZPL content to PDF
            doc.text(zpl, 10, 10);
            // Save PDF
            doc.save('label.pdf');
            
        }
        if(compressorBool == true)
        {
            console.log("inside")
            
        
            const itemsegment = ``;

            const matrixContent = `P${itemsegment}S${twoDigitYear}${dayOfYear}${serial}V0TDRC`;
            const zpl = `
            ^XA
            ^FX Date/Time
            ^FO5,25^A 0,30,30^FD ${time}^FS
            ^FO125,25^A 0,30,30^FD ${date}^FS
        
            ^FX User ID
            ^FO310,25^A 0,30,30^FD${user.userid}^FS

            ^FX Turbine/Compressor Housing
            ^FO5,55^A 0,30,30^FD Compressor Housing:^FS
            ^FO310,55^A 0,30,30^FD3592787^FS

            ^FX TD SQ
            ^FO5,85^A 0,30,30^FD TD SEQ:^FS
            ^FO310,85^A 0,30,30^FD2402070053 ^FS

            ^FO180,145^BXN,5,200,20,20,3,,1
            ^FD${matrixContent}^FS

            ^XZ 
            `;
            // Create a new instance of jsPDF
            const doc = new jsPDF();
            // Add ZPL content to PDF
            doc.text(zpl, 10, 10);
            // Save PDF
            doc.save('label.pdf');
        }
    }


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

    function updateBool(radioInput){
        if(radioInput == 1){
            console.log("radioinput 1")
            turbineBool = true;
            compressorBool = false;
        }
        else if(radioInput == 2){
            console.log("radioinput 2")
            turbineBool = false;
            compressorBool = true;
        }
        else if(radioInput == 3){
            console.log("radioinput 3")
            turbineBool = true;
            compressorBool = true;
        }
    }

    return(
        <div className="container-flex">
                <NavBar />
                <div className= "row mt-3">
                    <h1>First Fit Teardown</h1>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Reject Tickets</div>
                            <div className="card-body">
                                <div className="scanned-variables">
                                <input type="text" placeholder="Scanned: p240060168; ####### ; 00; ##; Beta Zone 3; AUTO; Y-M-D; h:m:s"></input>
                                </div>
                                <div className="ticket-details">
                                    <p>ID21: </p>
                                    <div id="iD21">5606202</div>
                                    <p>Model: </p>
                                    <div id ="model">HE300VG</div>
                                </div>
                                <div className="components-list">
                                    <p>Turbine Housing</p>
                                    <div id="turbineHousing">TD5499586</div>
                                    <p>Compressor Housing</p>
                                    <div id="compressorHousing">5500259</div>
                                    <p>Shroud Plate</p>
                                    <div id="shroudPlate">N/A</div>
                                </div>
                                <div className="radio-buttons">
                                    <label>Print:</label>
                                    <input type="radio" name="component" value="turbine" id="turbine" onClick={updateBool(1)}/>
                                    <label htmlFor="turbine">Turbine Housing</label>
                                    <input type="radio" name="component" value="compressor" id="compressor" onClick={updateBool(2)}/>
                                    <label htmlFor="compressor">Compressor Housing</label>
                                    <input type="radio" name="component" value="both" id="both" onClick={updateBool(3)}/>
                                    <label htmlFor="both">Both</label>
                                </div>
                                <div className="print-controls">
                                    <div className="auto-print">
                                        <input type="checkbox" id="autoPrint" />
                                        <label htmlFor="autoPrint">Auto Print</label>
                                    </div>
                                    <button className="print-button" onClick={printLabel}>Print</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Components</div>
                                <div className="card-body">
                                <label htmlFor="components">Components</label>
                                <select id="components">
                                    <option value="5500259">5500259. Compressor Housing</option>
                                </select>
                                <div className="print-qty">
                                    <label htmlFor="printQty">Print Qty:</label>
                                    <input type="number" id="printQty" defaultValue="1" />
                                    <button className="print-button">Print</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        </div>
    )
}