import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";
import ReportGeneral from './Valorizaciones/ReportGeneral'
import ResumenValorizacionObra  from './Valorizaciones/ResumenValorizacionObra'
import AvCompDiagGant  from './Valorizaciones/AvCompDiagGant'


class ReportesGenerales extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>REPORTES DE LA OBRA </CardHeader>
                    <CardBody>
                        <fieldset>
                            <legend>INFORMACIÓN DE LAS VALORIZACIONES DE LA OBRA</legend>
                            <ul className="nav flex-column ull">
                                <li className="lii">
                                    <a href="#" ><FaFilePdf className="text-danger"/> CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales) </a>
                                </li>
                                
                                <ReportGeneral />
                                {/* 6.3 */}
                                <ResumenValorizacionObra />
                                

                                <li className="lii">
                                    <a href="#" ><FaFilePdf className="text-danger"/>  VALORIZACIÓN POR MAYORES METRADOS (Si se generó)</a>
                                </li>
                                <AvCompDiagGant />
                            </ul>

                            
                        </fieldset>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default ReportesGenerales;