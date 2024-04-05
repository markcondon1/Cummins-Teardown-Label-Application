import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import  './page_styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from "jspdf";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiWrapper} from "../apiWrapper";
import {getDateTime} from "../dateTime";

export default function FirstFit(){

    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [numberEntry, setNumberEntry] = useState('');
    const [itemNum, setItemNum]=useState('');
    const [componentDescription, setComponentDescription] = useState('');

    const [componentOptions, setComponentOptions] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(''); 

    const [partSerial, setPartSerial] = useState('');
    const [id21, setid21] = useState('');
    const [model, setModel] = useState('');
    const [turbineHousing, setTurbineHousing] = useState('');
    const [compressorHousing, setCompressorHousing] = useState('');
    const [shroudPlate, setShroudPlate] = useState('');

    const date = getDateTime('date');

    const [radioSetting, setRadio] = useState('')
    const onOptionChange = e => {setRadio(e.target.value)}

    const handleInput = async (input)=>{
        //Example input for testing: P1908051718;5324132;
        //Format Example: P2406802175;5606728;00;Beta Zone 2;10;202;2024-03-11;02:56:46
        setPartSerial(input.slice(1,11));
        setid21(input.slice(12,19));
        try{
            const data = await apiWrapper('api/firstFit', 'GET', {serial:partSerial, id21:id21});
            if(data.success){
                console.log(data);
                setModel(data.compressor.MODEL_NUMBER);
                setTurbineHousing(data.turbine.COMPONENT_ITEM_NUMBER);
                setCompressorHousing(data.compressor.COMPONENT_ITEM_NUMBER);
                if(data.shroud){
                    setShroudPlate(data.shroud.COMPONENT_ITEM_NUMBER);
                }else{
                    setShroudPlate('N/A');
                }
            } else{
                console.error('Error in handleInput');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    var compressorBool = false;
    var turbineBool = false;

    console.log('Compressor Bool: ', compressorBool);

    const printLabel = () => {
        const currentDate = new Date();
        let start = new Date(currentDate.getFullYear(), 0, 0);
        let diff = (currentDate - start) + ((start.getTimezoneOffset() - currentDate.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let dayOfYear = Math.floor(diff / oneDay).toString().padStart(3,'0');
        
        const time = getDateTime('time');

        const twoDigitYear = currentDate.getFullYear().toString().slice(-2);

        const serial = handleSerial().toString().padStart(4,'0');
        
        if((radioSetting == "turbine") || (radioSetting == "both"))
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
            ^FO310,55^A 0,30,30^FD${turbineHousing}^FS
        
            ^FX TD SQ
            ^FO5,85^A 0,30,30^FD TD SEQ:^FS
            ^FO310,85^A 0,30,30^FD${twoDigitYear}${dayOfYear}${serial}^FS
        
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
        if((radioSetting == "compressor") || (radioSetting == "both"))
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
            ^FO5,55^A 0,30,30^FD Compressor Housing:^FS
            ^FO310,55^A 0,30,30^FD${compressorHousing}^FS

            ^FX TD SQ
            ^FO5,85^A 0,30,30^FD TD SEQ:^FS
            ^FO310,85^A 0,30,30^FD${twoDigitYear}${dayOfYear}${serial}^FS

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
        addPrintLog();
    }
    const addPrintLog = async ()=>{
        const date_printed = date;
        const time_printed = getDateTime('time');
        const print_station = 'First Fit';
        const userid = user.userid;
        const data = await apiWrapper('api/addLog', 'POST', {userid, time_printed,date_printed,print_station});
        console.log(data);
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
                                <input type="text" placeholder="Scanned: p240060168; ####### ; 00; ##; Beta Zone 3; AUTO; Y-M-D; h:m:s"
                                       onKeyDown={(e) => handleInput(e.target.value)}></input>
                                </div>
                                <div className="ticket-details">
                                    <p>ID21: </p>
                                    <div id="iD21">{id21}</div>
                                    <p>Model: </p>
                                    <div id ="model">{model}</div>
                                </div>
                                <div className="components-list">
                                    <p>Turbine Housing</p>
                                    <div id="turbineHousing">{turbineHousing}</div>
                                    <p>Compressor Housing</p>
                                    <div id="compressorHousing">{compressorHousing}</div>
                                    <p>Shroud Plate</p>
                                    <div id="shroudPlate">{shroudPlate}</div>
                                </div>
                                <div className="radio-buttons">
                                    <label>Print:</label>
                                    <input type="radio" name="component" value="turbine" id="turbine" onChange={onOptionChange}/>
                                    <label htmlFor="turbine">Turbine Housing</label>
                                    <input type="radio" name="component" value="compressor" id="compressor" onChange={onOptionChange}/>
                                    <label htmlFor="compressor">Compressor Housing</label>
                                    <input type="radio" name="component" value="both" id="both" onChange={onOptionChange}/>
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
                                <label htmlFor="components">Select Components</label>
                                <select id="components" className="form-control">
                                    {componentOptions.map((component, index) => (
                                        <option key={index} value={component.ID21_ITEM_NUMBER}>
                                            {`${component.ID21_ITEM_NUMBER} - ${component.COMPONENT_DESCRIPTION}`}
                                        </option>
                                    ))}
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