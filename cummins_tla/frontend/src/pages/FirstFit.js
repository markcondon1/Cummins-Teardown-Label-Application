import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import  './page_styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";

export default function FirstFit(){

    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    console.log("user: ", user);

    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Get the current year
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const date =`${month}/${day}/${year}`;
    const time = `${hours}:${minutes}:${seconds}`;

    //TODO: implement a printer function then can add print log below
    const printLog = {
        date: date,
        time: time,
        userID: user.userid,
    }
    console.log("print log", printLog);
    const reman=()=>{
        navigate("/app/Reman");
    }
    const teardown = () => {
        navigate("/app/teardownTray");
    }

    const firstFit = () =>{
        navigate("/app/firstFit");
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
                                    <input type="radio" name="component" value="turbine" id="turbine" />
                                    <label htmlFor="turbine">Turbine Housing</label>
                                    <input type="radio" name="component" value="compressor" id="compressor" />
                                    <label htmlFor="compressor">Compressor Housing</label>
                                    <input type="radio" name="component" value="both" id="both" />
                                    <label htmlFor="both">Both</label>
                                </div>
                                <div className="print-controls">
                                    <div className="auto-print">
                                        <input type="checkbox" id="autoPrint" />
                                        <label htmlFor="autoPrint">Auto Print</label>
                                    </div>
                                    <button className="print-button">Print</button>
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