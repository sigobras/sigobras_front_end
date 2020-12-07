import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, CardHeader, Button } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import RecursosObraResumen from './RecursosObraResumen';
import RecursosComponenteResumen from './RecursosComponenteResumen';
import RecursosComponentePartidas from './RecursosComponentePartidas';
import { FechaActual, Redondea } from '../../Utils/Funciones'

export default () => {

    return (
        <table className="table table-sm table-hover">
            <thead>
                <tr>
                    <th colSpan="5" className="bordeDerecho">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</th>
                    <th colSpan="5" > RECURSOS GASTADOS HASTA LA FECHA ( HOY {FechaActual()} )</th>
                </tr>
                <tr>
                    <th>RECURSO</th>
                    <th>UND</th>
                    <th>CANTIDAD</th>
                    <th>PRECIO S/.</th>
                    <th className="bordeDerecho" > PARCIAL S/.</th>

                    <th>CANTIDAD</th>
                    <th>PRECIO S/.</th>
                    <th>PARCIAL S/.</th>
                    <th>DIFERENCIA</th>
                    <th>%</th>
                </tr>
            </thead>
        </table>
    )
}
