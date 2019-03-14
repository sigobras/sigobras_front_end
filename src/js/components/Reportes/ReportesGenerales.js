import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";
import ReportGeneral from './Reporte6/ReportGeneral'
import ResumenValorizacionObra  from './Reporte6/ResumenValorizacionObra'
import AvCompDiagGant  from './Reporte6/AvCompDiagGant'


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
                            <legend>6.- INFORMACIÓN DE LAS VALORIZACIONES DE LA OBRA</legend>
                            <ul className="nav flex-column ull">
                                {/* 6.1 */}
                                <li className="lii">
                                    <a href="#" ><FaFilePdf className="text-danger"/> 1- CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales) </a>
                                </li>

                                {/* 6.2 */}
                                <ReportGeneral />

                                {/* 6.3 */}
                                <ResumenValorizacionObra />
                                
                                {/* 6.4 */}
                                <li className="lii">
                                    <a href="#" ><FaFilePdf className="text-danger"/> 4.- VALORIZACIÓN POR MAYORES METRADOS (Si se generó)</a>
                                </li>
                                
                                {/* 6.5 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 5.- VALORIZACIÓN DE PARTIDAS NUEVAS (Si se generó)  </a>
                                </li>

                                {/* 6.6 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 6.- CONSOLIDADO GENERAL DE LAS VALORIZACIONES ( PPTO. BASE+PAR. ADICIONALES)   </a>
                                </li>

                                {/* 6.7 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 7.- RESUMEN DE AVANCE FISICO DE LAS PARTIDAS DE OBRA POR MES Y % (METRADOS)</a>
                                </li>

                                
                                {/* 6.8 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 8.- AVANCES MENSUALES COMPARATIVOS DE ACUERDO AL PRESUPUESTO DE LA OBRA Y RES</a>
                                </li>

                                {/* 6.9 */}
                                <AvCompDiagGant />

                                {/* 6.10 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 10.- HISTOGRAMA DEL AVANCE DE OBRAS (Curva "S") </a>
                                </li>

                                {/* 6.11 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 11.- PROYECCIÓN DE LOS TRABAJOS PRÓXIMOS MES CRONOGRAMA </a>
                                </li>
                            </ul>

                            
                        </fieldset>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default ReportesGenerales;