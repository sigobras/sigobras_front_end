import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
// import AppAng from './js/components/App';
import Login from '../src/js/components/Login/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import './css/bs4.css';
import 'react-table/react-table.css'
import 'react-toastify/dist/ReactToastify.css';
const AppAng = lazy(() => import('./js/components/App'));
const wrapper = document.getElementById("zoe");

if (sessionStorage.getItem("idacceso") === null) {
    wrapper ? ReactDOM.render(<Login />, wrapper) : false;
} else {
    wrapper ? ReactDOM.render(
        <Suspense  fallback={<div>Loading...</div>}>
            <AppAng />
        </Suspense>
        , wrapper) : false;
}