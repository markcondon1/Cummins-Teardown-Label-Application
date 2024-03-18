import {useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import BarCode from './barcode.png';
import DataMatrix from './datamatrix.png'
import logo from "./logo.png"
import './RemanLabelPreview.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


function RemanLabelPreview(){
    return (
            <div class="label-preview-container">
            <div className="row">
            <div className="col-md-6">
                <img src={BarCode} height={60} width={420}/>{''}
                <h2>XXXXXXX-RX</h2>
                
                <div className="row">
                <div className="col-sm">
                    <div className="row">
                    <div className="col-sm">
                        <img className="logo" src={logo}/>{''}
                    </div>
                    <div className="col-sm">
                        <p>11:47PM</p>
                        <p>1/6/2024</p>
                    </div>
                    <div className="col-1">
                        <p>WWID</p>
                        </div>
                    </div>
                </div>
                <div className="long">
                    <h2>PXXXXXXX-RXS006114715VTDRC</h2>
                </div>
                </div>
                </div>
                <div className="col-md-6">
                    <img className="data-matrix" src={DataMatrix} />{''}
                </div>
            </div>
            </div>

    )
}

export default RemanLabelPreview;