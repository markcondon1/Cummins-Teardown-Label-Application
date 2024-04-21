import {apiWrapper} from "../apiWrapper";
import React, {useEffect, useState} from "react";
import NavBar from "./components/NavBar";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

export default function PrinterLogs(){
    const [userId, setUserId] = useState('');
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

   //get logs pulls in all the printer logs in the printer log database table.
   //from there it accumulates them into a table grid.
    const getLogs = async () => {
        try{

            const input = {item: userId};
            //call to backend print log function
            const logPull = await apiWrapper('api/printLog', 'POST', {input});

            if (logPull.message === 'printer logs found') {
                const logs = logPull.logs.map((log, index) => ({
                    id: index + 1,
                    userid: log.userid,
                    datePrinted: log.date_printed,
                    timePrinted: log.time_printed,
                    printStation: log.print_station,
                }));
                setRows(logs);
            } else {
                setRows([]);
            }
        }catch (error) {
            console.error('Error:', error);

        }
    }
    useEffect(()=>{
        getLogs();
    },[]);

    const backNavigate=()=>{
        navigate("/app/admin");
    }


    const columns=[
    { field: 'userid', headerName: 'User ID', width: 400 },
    { field: 'datePrinted', headerName: 'Date Printed', width: 400 },
    { field: 'timePrinted', headerName: 'Time Printed', width: 400 },
    { field: 'printStation', headerName: 'Print Station', width: 400 },
];


    return(
        <div class="container-flex">
            <NavBar />
            <Button onClick={backNavigate} className="back-button printer-logs-back-button">
                <FaArrowLeft /> Back
            </Button>
            <div style={{ margin: '20px' }}>
                <h4>Printer Logs</h4>
            <DataGrid
                rows={rows}
                columns = {columns}
                pageSize={4}
                slots={{ toolbar: GridToolbar }}
            />
            </div>
        </div>
    )

}