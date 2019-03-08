import React, { Component } from 'react';
import HigtChart from "../Pgerenciales/HigtChart";

import imgx1 from '../Pgerenciales/GaleriaImagenes/imagenesTemporal/sigobras1.jpeg';
import img2 from '../Pgerenciales/GaleriaImagenes/imagenesTemporal/sigobras2.jpg';


class CtrladminDirecta extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-7">
                    <HigtChart />
                </div>
                <div className="col-sm-5">
                    <img src={ imgx1 } className="img-fluid" width="60%"/>
                    <img src={ img2 } className="img-fluid" width="60%"/>
                </div>
            </div>
        );
    }
}

export default CtrladminDirecta;