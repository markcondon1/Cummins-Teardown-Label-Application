import NavBar from "./components/NavBar";
import  './page_styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from "jspdf";
import {useSelector} from "react-redux";
import {useEffect, useState, useRef} from "react";
import {apiWrapper} from "../apiWrapper";
import {getDateTime} from "../dateTime";

export default function FirstFit(){
    const user = useSelector(state => state.user);
    const [partSerial, setPartSerial] = useState('');
    const [id21, setid21] = useState('');
    const [model, setModel] = useState('');
    const [turbineHousing, setTurbineHousing] = useState('');
    const [compressorHousing, setCompressorHousing] = useState('');
    const [shroudPlate, setShroudPlate] = useState('');
    const date = getDateTime('date');
    const time  = getDateTime('time');
    const [componentNumber, setComponentNumber] = useState('');


    const [autoPrint, setAutoPrint] = useState(false);
    const [radioSetting, setRadio] = useState('');

    //state for handling input and suggestions
    const [componentInput, setComponentInput] = useState('');
    const [componentSuggestions, setComponentSuggestions] = useState([]);

    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Get the current year
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const onOptionChange = e => {setRadio(e.target.value)}

    //handles focusing input box
    const rejectInput = useRef(null);
    useEffect(() => {
    if (rejectInput.current) {
      rejectInput.current.focus();
    }
    }, []);

    const handleAutoPrintChange = (e) => {
        setAutoPrint(e.target.checked);
    }

    useEffect(() => {
        if (autoPrint && radioSetting) {
            printLabel();
        }
    }, [radioSetting, autoPrint]);

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
                setComponentNumber(data.compressor.COMPONENT_ITEM_NUMBER);
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

    //handles print label taken from scans, responds to radio buttons
    const printLabel = () => {

        let start = new Date(currentDate.getFullYear(), 0, 0);
        let diff = (currentDate - start) + ((start.getTimezoneOffset() - currentDate.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let dayOfYear = Math.floor(diff / oneDay).toString().padStart(3,'0');
        
        const item_segment1 = document.getElementById("rejectInput").value.toString();
        const itemsegment = item_segment1.toString();
        const time = getDateTime('time');

        const twoDigitYear = currentDate.getFullYear().toString().slice(-2);

        const serial = handleSerial().toString().padStart(4,'0');
        //if radio button is selected to Turbine Housing or Both
        if((radioSetting === "turbine") || (radioSetting === "both"))
        {

        const matrixContent = `P0${itemsegment}S${twoDigitYear}${dayOfYear}${serial}V0TDRC`;
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
            addPrintLog();
        }
        //if radio button is selected to Compressor Housing or Both
        if((radioSetting === "compressor") || (radioSetting === "both"))
        {           
            const matrixContent = `P0${itemsegment}S${twoDigitYear}${dayOfYear}${serial}V0TDRC`;
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
            addPrintLog();
        }
    }
    //handles adding print logs
    const addPrintLog = async ()=>{
        const date_printed = date;
        const time_printed = time;
        const print_station = 'First Fit';
        const userid = user.userid;
        const data = await apiWrapper('api/addLog', 'POST', {userid, time_printed,date_printed,print_station});
        console.log(data);
        
    }
    //handles printing of the components label
    const printComponentLabel = () =>{

        let start = new Date(currentDate.getFullYear(), 0, 0);
        let diff = (currentDate - start) + ((start.getTimezoneOffset() - currentDate.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let dayOfYear = Math.floor(diff / oneDay).toString().padStart(3,'0');

        const printQuantity = document.getElementById("printQty").value;

        const itemsegment = componentInput;
        
        const date =`${month}/${day}/${year}`;
        const time = `${hours}:${minutes}:${seconds}`;

        const twoDigitYear = year.toString().slice(-2);

        const serial = handleSerial().toString().padStart(4,'0');
        
        const matrixContent = `P0${itemsegment}S${twoDigitYear}${dayOfYear}${serial}V0TDRC`;
            const zpl = `
            ^XA
            ^FX Date/Time
            ^FO5,25^A 0,30,30^FD ${time}^FS
            ^FO125,25^A 0,30,30^FD ${date}^FS
        
            ^FX User ID
            ^FO310,25^A 0,30,30^FD${user.userid}^FS

            ^FX Component Number:
            ^FO5,55^A 0,30,30^FD Component Number:^FS
            ^FO310,55^A 0,30,30^FD${itemsegment}^FS 

            ^FX TD SQ
            ^FO5,85^A 0,30,30^FD TD SEQ:^FS
            ^FO310,85^A 0,30,30^FD${twoDigitYear}${dayOfYear}${serial}^FS

            ^FO180,145^BXN,5,200,20,20,3,,1
            ^FD${matrixContent}^FS

            ^XZ 
            `;

            // Create a new instance of jsPDF
            const doc = new jsPDF();

            //handles print quantity
            for(var i = 1; i < printQuantity; i++)
            {
                // Add ZPL content to PDF
                doc.text(zpl, 10, 10);
                // Save PDF
                doc.save('label.pdf');
            }
            
            // Add ZPL content to PDF
            doc.text(zpl, 10, 10);
            // Save PDF
            doc.save('label.pdf');
            //addPrintLog();
    }

    //handles handle serial numbers, if one exists for the day, then 1 is added to it. If not, one is generated via createSerial. 
    //This currently shares the serial number with Reman, so the number is consistent across both pages
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

    //handles creation of serial number if one does not exist for the day
    const createSerial = () =>{
        const currentDate = new Date();
        const serialData = {
            serial:1,
            date:currentDate,
        };
        localStorage.setItem('serialData', JSON.stringify(serialData))
        return JSON.parse(localStorage.getItem('serialData')).serial;
    };

   
    
    useEffect(() => {
        if (componentInput.length > 2) {
            const fetchComponents = async () => {
                try {
                    const response = await apiWrapper('api/getDropdown', 'GET', {component: componentInput});
                    if (response.success) {

                        setComponentSuggestions(response.dropdown);
                        console.log(componentSuggestions);
                    } else {
                        setComponentSuggestions([]);
                    }
                } catch (error) {
                    console.error('Failed to fetch components', error);
                }
            };

            fetchComponents();
        } else {
            setComponentSuggestions([]);
        }
    }, [componentInput]);

    
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
                                <input type="text" ref = {rejectInput} id="rejectInput" placeholder="Scanned: p240060168; ####### ; 00; ##; Beta Zone 3; AUTO; Y-M-D; h:m:s"
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
                                        <input type="checkbox" id="autoPrint" checked={autoPrint} onChange={handleAutoPrintChange} />
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
                                    <label htmlFor="componentInput">Select Components</label>
                                        <input 
                                            list="componentList" 
                                            id="componentInput" 
                                            className="form-control"
                                            placeholder="Type to search components..."
                                            value={componentInput}
                                            onChange={(e) => setComponentInput(e.target.value)}
                                        /> 
                                        <datalist id="componentList">
                                            {componentSuggestions.map((item, index) => (
                                                <option key={index} value={item.COMPONENT_ITEM_NUMBER} />
                                            ))}
                                        </datalist>

                                {/*<select id="components" className="form-control">*/}
                                {/*    {componentOptions.map((component, index) => (*/}
                                {/*        <option key={index} value={component.ID21_ITEM_NUMBER}>*/}
                                {/*            {`${component.ID21_ITEM_NUMBER} - ${component.COMPONENT_DESCRIPTION}`}*/}
                                {/*        </option>*/}
                                {/*    ))}*/}
                                {/*</select>*/}
                                <div className="print-qty">
                                    <label htmlFor="printQty">Print Qty:</label>
                                    <input type="number" id="printQty" defaultValue="1" />
                                    <button className="print-button" onClick={printComponentLabel}>Print</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        </div>
    )
}