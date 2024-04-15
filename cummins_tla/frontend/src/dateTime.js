import { FaSadCry } from "react-icons/fa";

export const getDateTime = (input) =>{
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Get the current year
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    if(input === 'date')
    {
        return `${month}/${day}/${year}`;
    } else if (input === 'time'){
       return `${hours}:${minutes}:${seconds}`;
    }
    else{
        console.log('Error in dateTime.js, incorrect input');
        return false;
    }
}