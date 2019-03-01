import React from "react";
import ReactDOM from "react-dom";
import AppAng from './js/components/App';
import Login from '../src/js/components/Login/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import './css/bs4.css';
import 'react-table/react-table.css'
import 'react-toastify/dist/ReactToastify.css';

if(sessionStorage.getItem("idacceso") === null){
    const wrapper = document.getElementById("zoe");
    wrapper ? ReactDOM.render(<Login />, wrapper) : false;
}else{
    const wrapper = document.getElementById("zoe");
    wrapper ? ReactDOM.render(<AppAng />, wrapper) : false;
}