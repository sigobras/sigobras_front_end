import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, CardHeader, Button } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import RecursosObraResumen from './RecursosObraResumen';
import RecursosComponenteResumen from './RecursosComponenteResumen';
import RecursosComponentePartidas from './RecursosComponentePartidas';

export default () => {

    useEffect(() => {
        fectchComponentes()
    }, []);

    // -------------------> Componentes
    const [Componentes, setComponentes] = useState([]);
    async function fectchComponentes() {
        const res = await axios.post(`${UrlServer}/getComponentes`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        setComponentes(res.data)
        // console.log("res.data", res.data);
    }
    const [ComponenteSelecccionado, setComponenteSelecccionado] = useState({ numero: 0, nombre: "RESUMEN" });
    function onChangeComponentesSeleccionado(componente) {
        setComponenteSelecccionado(componente)
    }

    const [ComponenteInterfaz,setComponenteInterfaz] = useState('RESUMEN')

    return (
        <div>

            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={ComponenteSelecccionado.numero == 0 && 'active'}
                        onClick={() => onChangeComponentesSeleccionado({ numero: 0, nombre: "RESUMEN" })}
                    >
                        RESUMEN
              </NavLink>
                </NavItem>
                {/* {
                    Componentes.map((item, i) =>
                        <NavItem key={i}>
                            <NavLink
                                className={ComponenteSelecccionado.numero == item.numero && 'active'}
                                onClick={() => onChangeComponentesSeleccionado(item)}
                            >
                                C-{item.numero}
                            </NavLink>
                        </NavItem>
                    )} */}
            </Nav>

            {
                ComponenteSelecccionado.numero == 0 ?
                    <RecursosObraResumen />
                    :
                    <div>
                        <CardHeader> {ComponenteSelecccionado.nombre} </CardHeader>
                        <Nav tabs className="float-right">
                            <NavItem>
                                <NavLink 
                                // className={classnames({ "bg-warning text-dark": this.state.CollapseResumenTabla === 'resumenRecursos' })} 
                                onClick={() => {setComponenteInterfaz('RESUMEN')}} 
                                >
                                    MOSTRAR RESUMEN  
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink 
                                // className={classnames({ "bg-warning text-dark": this.state.CollapseResumenTabla === 'tablaPartidas' })} 
                                onClick={() => {setComponenteInterfaz('PARTIDAS')}}  
                                >
                                    MOSTRAR POR PARTIDA 
                                </NavLink>
                            </NavItem>
                        </Nav>
                        {
                            ComponenteInterfaz == 'RESUMEN' ? 
                            <RecursosComponenteResumen /> : ""
                            // <RecursosComponentePartidas /> 
                        }
                    </div>

            }

        </div>
    );
}

