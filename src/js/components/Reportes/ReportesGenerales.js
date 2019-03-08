import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import ResumenValorizacionObra from './Valorizaciones/ResumenValorizacionObra'
import { FaFilePdf } from "react-icons/fa";

class ReportesGenerales extends Component {
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
                                    <a href="#" ><FaFilePdf /> CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales) </a>
                                </li>

                                <li className="lii">
                                    <a href="#" ><FaFilePdf /> VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE </a>
                                </li>

                                <li className="lii">
                                    <a href="#" ><FaFilePdf />  RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE</a>
                                </li>

                                <li className="lii">
                                    <a href="#" ><FaFilePdf />  VALORIZACIÓN POR MAYORES METRADOS (Si se generó)</a>
                                </li>
                            </ul>

                            <ResumenValorizacionObra />
                        </fieldset>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default ReportesGenerales;