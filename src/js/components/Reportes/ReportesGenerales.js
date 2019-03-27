import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";
import CtrlEjecDirecta from './ReporteInicio/CtrlEjecDirecta'
import Report_1 from './Reporte6/Report_1'
import Report_2 from './Reporte6/Report_2'
import Report_3 from './Reporte6/Report_3'
import Report_4 from './Reporte6/Report_4'
import Report_5 from './Reporte6/Report_5'

import Report_8 from './Reporte6/Report_8'
import Report_9 from './Reporte6/Report_9';


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

                        <fieldset className="mb-3">
                            <legend>INFORME GENERAL DE OBRAS A MI CARGO</legend>
                            <ul className="nav flex-column ull">
                                <CtrlEjecDirecta />
                            </ul>
                        </fieldset>

                        <fieldset>
                            <legend>6.- INFORMACIÓN DE LAS VALORIZACIONES DE LA OBRA</legend>
                            <ul className="nav flex-column ull">
                                {/* 6.1 */}
                                <Report_1 />        


                                {/* 6.2 */}
                                <Report_2 /> 

                                {/* 6.3 */}
                                <Report_3 />
                                
                                {/* 6.4 */}
                                <Report_4 />
                                
                                {/* 6.5 */}
                                <Report_5 />

                                {/* 6.6 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 6.- CONSOLIDADO GENERAL DE LAS VALORIZACIONES ( PPTO. BASE+PAR. ADICIONALES)   </a>
                                </li>

                                {/* 6.7 */}
                                <li className="lii">    
                                    <a href="#" ><FaFilePdf className="text-danger"/> 7.- RESUMEN DE AVANCE FISICO DE LAS PARTIDAS DE OBRA POR MES Y % (METRADOS)</a>
                                </li>

                                
                                {/* 6.8 */}
                                {/* <Report_8 /> */}

                                {/* 6.9 */}
                                {/* <Report_9 /> */}

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