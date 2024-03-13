// import fetch from 'node-fetch';
//
// //printer logic
//
// async function postZplAndReturnImageName(zpl, printerIpAddress) {
//     const parameters = new URLSearchParams({
//         data: zpl,
//         dev: 'R',
//         oname: 'UNKNOWN',
//         otype: 'ZPL',
//         prev: 'Preview Label',
//         pw: ''
//     });
//
//     const response = await fetch(`http://${printerIpAddress}/zpl`, {
//         method: 'POST',
//         body: parameters
//     });
//
//     const html = await response.text();
//
//     const doc = new DOMParser().parseFromString(html, 'text/html');
//     const imageName = doc.querySelector('img').getAttribute('alt').substring(2).slice(0, -4);
//
//     return imageName;
// }
//
// async function loadImageFromPrinter(imageName, printerIpAddress) {
//     const url = `http://${printerIpAddress}/png?prev=Y&dev=R&oname=${imageName}&otype=PNG`;
//
//     const response = await fetch(url);
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//
//     // Assuming you're using Node.js, you can create a buffer from the arrayBuffer
//
//     // Alternatively, in a browser environment, you can convert the arrayBuffer to a Blob
//     // const blob = new Blob([arrayBuffer], { type: 'image/png' });
//     // const imageUrl = URL.createObjectURL(blob);
//     // return imageUrl;
//
//     return buffer;
// }
//
// async function main() {
//     const printerIpAddress = '10.92.0.167';
//     const zpl = '^XA^CFD^CVY^PON^FWN^LS0^LT0^LH15,17^FS^FO0,2^FO14,3^FH^FDHi^FS^XZ';
//
//     const imageName = await postZplAndReturnImageName(zpl, printerIpAddress);
//     const imageBuffer = await loadImageFromPrinter(imageName, printerIpAddress);
//
//     console.log(imageBuffer);
// }
//
// main().catch(error => console.error(error));