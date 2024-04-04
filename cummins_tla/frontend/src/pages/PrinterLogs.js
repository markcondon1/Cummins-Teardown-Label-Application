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


    const getLogs = async () => {
        try{
            console.log("user id ", userId);
            const input = {item: userId};
            const logPull = await apiWrapper('api/printLog', 'POST', {input});
            console.log("logs ", logPull);
            // if (logPull.message === 'printer logs found') {
            //     const logs = logPull.logs;
            //     console.log("Logs: ", logs);
            //     console.log("logs type? ", typeof logs);
            //
            let index = 0
                 console.log("length ", logPull.length);
            if (logPull.message === 'printer logs found') {
                const logs = logPull.logs.map((log, index) => ({
                    id: index + 1,
                    userid: log.userid,
                    datePrinted: log.date_printed,
                    timePrinted: log.time_printed,
                    printStation: log.print_station,
                }));
                console.log("Logs: ", logs);
                setRows(logs);
            } else {
                setRows([]);
            }

               // console.log("rows ",newRows);

        }catch (error) {
            console.error('Error:', error);
            ;
        }
    }
    getLogs();
    console.log("rows: ", rows)

    const columns=[
    { field: 'userid', headerName: 'User ID', width: 400 },
    { field: 'datePrinted', headerName: 'Date Printed', width: 400 },
    { field: 'timePrinted', headerName: 'Time Printed', width: 400 },
    { field: 'printStation', headerName: 'Print Station', width: 400 },
];

   // console.log("rows ", rows);

    return(
        <div>
            <div>
                <NavBar />
                <div style={{ margin: '20px' }}>
                <DataGrid
                    rows={rows}
                    columns = {columns}
                    pageSize={5}
                />
                </div>
            </div>

        </div>
    )

}