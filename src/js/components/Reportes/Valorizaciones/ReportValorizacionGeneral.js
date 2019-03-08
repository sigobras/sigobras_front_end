import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ReportValorizacionGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false
        };
    
        this.modalValGeneral = this.modalValGeneral.bind(this);
    }
    
    modalValGeneral() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
        <div className="">
            <button className="btn btn-outline-success btn-xs" onClick={ this.modalValGeneral }>VAL</button>
        
            <Modal isOpen={this.state.modal} fade={false} toggle={this.modalValGeneral} size="xl">
                <ModalHeader toggle={this.modalValGeneral}>CONSOLIDADO GENERAL DE VALORIZACION DE OBRA N° 08 - 2018</ModalHeader>
                <ModalBody>
                    <table className="table table-bordered table-sm small">
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th colspan="10">CONSOLIDADO GENERAL DE VALORIZACION DE OBRA N° 08 - 2018</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="6">PROYECTO</td>
                            <td colspan="13">VARCHAR</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="6">OBRA</td>
                            <td colspan="13">VARCHAR</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>MES</td>
                            <td colspan="3"></td>
                        </tr>
                        <tr>
                            <td colspan="6">MONTO DE LA OBRA</td>
                            <td colspan="5">VARCHAR</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>REGION</td>
                            <td colspan="3"></td>
                        </tr>
                        <tr>
                            <td colspan="6">FECHA DE INICIO DE OBRA</td>
                            <td colspan="5">DATE</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td colspan="3">RESIDENTE DE OBRA</td>
                            <td colspan="4">VARCHAR</td>
                            <td></td>
                            <td>PROVINCIA</td>
                            <td colspan="3"></td>
                        </tr>
                        <tr>
                            <td colspan="6">PLAZO DE EJECUCION </td>
                            <td colspan="5">VARCHAR</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td colspan="3">SUPERVISOR DE OBRA</td>
                            <td colspan="4">Ing. Robert A. Rivera MAldonado</td>
                            <td></td>
                            <td>DISTRITO</td>
                            <td colspan="3"></td>
                        </tr>
                        <tr>
                            <td colspan="6">% AVANCE FISICO </td>
                            <td colspan="5">Int</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td colspan="3">AVANCE ACUMULADO</td>
                            <td colspan="4">Int</td>
                            <td></td>
                            <td>LUGAR</td>
                            <td colspan="3"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>

                    <table  className="table table-bordered table-sm small">> 
                        <tr>
                            <th colspan="3" rowspan="3">PARTIDA</th>
                            <th colspan="11" rowspan="3">DESCRIPCION</th>
                            <th rowspan="3">UND</th>
                            <th colspan="3" rowspan="2">PRESUPUESTO PROGRAMADO</th>
                            <th colspan="9">JUNIO DEL 2018</th>
                            <th colspan="3" rowspan="2">SALDO</th>
                        </tr>
                        <tr>
                            <td colspan="3">ANTERIOR</td>
                            <td colspan="3">ACTUAL</td>
                            <td colspan="3">ACUMULADO</td>
                        </tr>
                        <tr>
                            <td>METRADO</td>
                            <td>P. UNIT S/.</td>
                            <td>PRESUP. S/.</td>
                            <td>METRADO</td>
                            <td>TALARIZADO</td>
                            <td>%</td>
                            <td>METRADO</td>
                            <td>TALARIZADO</td>
                            <td>%</td>
                            <td>METRADO</td>
                            <td>TALARIZADO</td>
                            <td>%</td>
                            <td>METRADO</td>
                            <td>TALARIZADO</td>
                            <td>%</td>
                        </tr>
                        <tr>
                            <td colspan="3"></td>
                            <td colspan="11">Construccion de 01 un aula pedagogica</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3">01</td>
                            <td colspan="11">Obras provisionales, trabajos preliminares, seguridad y salud</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3">01.01</td>
                            <td colspan="11">construciones provisionales</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3">01.01.01</td>
                            <td colspan="11">VARCHAR</td>
                            <td>GLB</td>
                            <td>1.000</td>
                            <td>3.132</td>
                            <td>3.122323</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                            <td>int</td>
                        </tr>
                        <tr>
                            <td colspan="3"></td>
                            <td colspan="11"></td>
                            <td>UND</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </ModalBody>
                <ModalFooter>
                   
                    <Button color="secondary" onClick={this.modalValGeneral}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </div>
        );
    }
}

export default ReportValorizacionGeneral;