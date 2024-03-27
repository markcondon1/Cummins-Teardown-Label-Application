import { end } from "@popperjs/core";

const baseUrl = 'http://localhost:8080/';
export const apiWrapper = async (endpoint, method, input) => {
    let response;
    if(method === 'GET'){
        if(input !== null){
            input = new URLSearchParams(input);
            response = await fetch(`${baseUrl}${endpoint}?${input}`);
        }
        else{
            response = fetch(`${baseUrl}${endpoint}`);
        }
    }else if(method === 'POST' && input !== null){
        response = await fetch(`${baseUrl}${endpoint}`,{
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });
    }
    return response.json();
};