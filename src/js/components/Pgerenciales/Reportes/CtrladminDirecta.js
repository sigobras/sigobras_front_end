import React, { Component } from 'react';

class CtrladminDirecta extends Component {
    render() {
        return (
            <div className="table-responsive">
                <label className="h6 text-center"> CONTROL DE EJECUCION DE OBRAS POR ADMINSTRACION DIRECTA</label>
                <div className="bg-info text-center"> PROYECTO EN EJECUCION</div>
                <table className="table table-bordered table-sm small" style={{width:'100%', fontSize:'10px', border:'1px solid dark'}} >
                    <tbody>
                        <tr>
                            <th>ENTIDAD FINANCIERA</th>
                            <td>: GOBIERNO REGIONAL PUNO</td>
                            <th rowSpan="4"></th>
                            <th>PRESUPUESTO BASE</th>
                            <td>S/. 9892323</td>
                            <th rowSpan="4"></th>
                            <th>PLAZO DE EJECUCION INICIAL</th>
                            <td>180 DIAS CALENDARIO</td>
                        </tr>
                        <tr>
                            <th>MODALIDAD DE EJECUCION</th>
                            <td>: ADMIN DIRECTA</td>
                            <td>AMPLIACION PRESUPUESTO N° 1</td>
                            <td>S/. 232323</td>
                            <td>AMPLIACION DE PLAZO N° 01</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>FUENTE DE INFORMACION</th>
                            <td>:SUB GERENCIA DE OBRA</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>ACTUALIZADO AL</th>
                            <td>: 30 DE FEBRERO DEL 2019</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <table className="table table-bordered table-sm small" style={{width:'100%', fontSize:'10px', border:'1px solid dark'}} >
                    <thead>
                        <tr>
                            <th colSpan="20">CONSOLIDADO DEL INFORME MENSUAL DE OBRA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan="3">ITEM</td>
                            <td rowSpan="3">DESCRIPCIÓN DEL PROYECTO</td>
                            <td rowSpan="3">PPTO E.T. (S/.) + ADICIONALES</td>
                            <td colSpan="2">RESPONSABLES DE OBRA</td>
                            <td colSpan="4">TIEMPO DE EJECUCIÓN</td>
                            <td colSpan="6">VALORACIÓN ACUMULADA</td>
                            <td rowSpan="3">MES REPORTADO</td>
                            <td rowSpan="3">SITUACION ACTUAL</td>
                            <td rowSpan="3">METAS PROGRAMADAS</td>
                            <td rowSpan="3">METAS EJECUTADAS</td>
                            <td rowSpan="3">COMENTARIO</td>
                        </tr>
                        <tr>
                            <td rowSpan="2">SUPERVISOR DE OBRA</td>
                            <td rowSpan="2">RESIDENTE DE OBRA</td>
                            <td rowSpan="2">PLAZO DE EJECUCIÓN (DÍAS CALENDARIOS)</td>
                            <td rowSpan="2">FECHA INICIO E.T. INICIAL</td>
                            <td rowSpan="2">FECHA CULMINACIÓN E.T. INICIAL</td>
                            <td rowSpan="2">AMPLÍACION DE PLAZO (FECHA DE TÉRMINO)</td>
                            <td colSpan="2">FINANCIERO</td>
                            <td colSpan="2">FÍSICO PRES. BASE</td>
                            <td colSpan="2">AMPLIACIÓN PRESUPUESTAL VAL. FÍSICA</td>
                        </tr>
                        <tr>
                            <td>MONTO EN S/.</td>
                            <td>ACUM. %</td>
                            <td>MONTO EN S/.</td>
                            <td>ACUM. %</td>
                            <td>MONTO EN S/.<br /></td>
                            <td>ACUM. %</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CtrladminDirecta;