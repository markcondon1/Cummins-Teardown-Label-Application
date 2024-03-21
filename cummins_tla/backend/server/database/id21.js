import './db.js';
import sql from "./db";

export async function makeIdData(){
    let result = [];

    const i = 0;
    for(let i=0;i<100;i++){
        result[i] = Math.floor(1000000 + Math.random() * 900000);

    }

    const uid= await sql`
        INSERT INTO USERS, id21_item_number
        values ${result[i]}
`;

}
