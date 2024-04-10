import Button from "react-bootstrap/Button";
import {apiWrapper} from "../apiWrapper";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import { DataGrid } from '@mui/x-data-grid';


export default function PrinterLogs(){
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

   //get logs pulls in all the printer logs in the printer log database table.
   //from there it accumulates them into a table grid.
    const getLogs = async () => {
        try{

            const input = {item: userId};
            //call to backend print log function
            const logPull = await apiWrapper('api/printLog', 'POST', {input});

            let index = 0

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


    const columns=[
    { field: 'userid', headerName: 'User ID', width: 400 },
    { field: 'datePrinted', headerName: 'Date Printed', width: 400 },
    { field: 'timePrinted', headerName: 'Time Printed', width: 400 },
    { field: 'printStation', headerName: 'Print Station', width: 400 },
];


    return(
        <div>
            <div>
                <NavBar />
                <div style={{ margin: '20px' }}>
                <DataGrid
                    rows={rows}
                    columns = {columns}
                    pageSize={4}
                />
                </div>
            </div>

        </div>
    )

}