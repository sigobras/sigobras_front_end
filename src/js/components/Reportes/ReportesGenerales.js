import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import Report1 from './Reporte6/Report1';
import Report2 from './Reporte6/Report2';
import Report3 from './Reporte6/Report3';

class ReportesGenerales extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<Card>
					<CardHeader>REPORTES DE LA OBRA </CardHeader>
					<CardBody>
						{/* <fieldset className="mb-3">
                            <legend>INFORME GENERAL DE OBRAS A MI CARGO</legend>
                            <ul className="nav flex-column ull">
                                <CtrlEjecDirecta />
                            </ul>
                        </fieldset> */}

						<fieldset>
							<legend>6.- INFORMACIÓN DE LAS VALORIZACIONES DE LA OBRA</legend>
							<ul className='nav flex-column ull'>
								{/* 6.1 */}
								<Report1 />

								{/* 6.2 */}
								<Report2 />

								{/* 6.3 */}
								<Report3 />

								{/* 6.4 */}
								{/* <Report_curva_s/> */}
								{/* <Report_4 /> */}

								{/* 6.5 */}
								{/* <Report_5 /> */}
								{/* <Report_ficha_tecnica/> */}

								{/* 6.6 */}
								{/* <Report_6 /> */}

								{/* 6.7 */}
								{/* <Report_7 /> */}

								{/* 6.8 */}
								{/* <Report_8 /> */}

								{/* 6.9 */}
								{/* <Report_9 /> */}

								{/* 6.10 */}
								{/* <Report10 /> */}

								{/* 6.11 */}
								{/* <li className="lii">
                                    <a href="#" ><FaFilePdf className="text-danger"/> 11.- PROYECCIÓN DE LOS TRABAJOS PRÓXIMOS MES CRONOGRAMA </a>
                                </li> */}
							</ul>
						</fieldset>
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default ReportesGenerales;
