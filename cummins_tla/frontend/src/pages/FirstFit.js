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

export default function FirstFit(){

    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [numberEntry, setNumberEntry] = useState('');
    const [itemNum, setItemNum]=useState('');
    const [componentDescription, setComponentDescription] = useState('');

    const [componentOptions, setComponentOptions] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(''); 

    const [dbComponentNum, setDbComponentNum] = useState('');
    const [dbComponentid, setdbComponentid] = useState('');
    const [componentNum, setComponentNum] = useState('');
    const [modelType, setModelType] = useState('');

    console.log("user: ", user);

    const [radioSetting, setRadio] = useState('')
    const onOptionChange = e => {setRadio(e.target.value)}

    const handleComponent = async (numberEntry)=>{
        try{
            //    const input = {item:numberEntry};
             const newVal = parseInt(numberEntry);
            console.log("input ", newVal);
            const input = {item: newVal};
            const data = await apiWrapper('api/firstFit', 'POST', {newVal});
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

                setdbComponentid(dataArray[0].ID21_ITEM_NUMBER);
                setComponentDescription(dataArray[0].COMPONENT_DESCRIPTION);

            }else{
                console.log("fail");

            }


        } catch (error) {
            console.error('Error:', error);
        }
    }

    const modelPull = async ()=>{
        try{
            const data = await apiWrapper('api/modelNumber', 'GET', {dbComponentNum, dbComponentid});

            data.rows.forEach(row => {
           //    console.log("models ", row.MODEL_NUMBER);
                if(dbComponentid === row.ID21_ITEM_NUMBER){
                    setModelType(row.MODEL_NUMBER);
                    //this should work if the ID21's in the databases matchup, but
                    //for now the dummy data given is insufficient, so hardcoding
                    console.log("succes: model type ", modelType);
                }
            });

        } catch (error) {
            console.error('Error:', error);

        }
    }



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
            ^FO310,55^A 0,30,30^FD${dbComponentNum}^FS
        
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
        if((radioSetting == "compressor") || (radioSetting == "both"))
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


    useEffect(() => {
        const fetchComponents = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/mesComponents');
            if (response.data && response.data.rows) {
              setComponentOptions(response.data.rows);
            }
          } catch (error) {
            console.error('Error fetching component data:', error);
          }
        };
    
        fetchComponents();
      }, []);

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
                                       onKeyDown={(e) => handleComponent(e.target.value)}></input>
                                </div>
                                <div className="ticket-details">
                                    <p>ID21: </p>
                                    <div id="iD21">{dbComponentid}</div>
                                    <p>Model: </p>
                                    <div id ="model">{modelType}</div>
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