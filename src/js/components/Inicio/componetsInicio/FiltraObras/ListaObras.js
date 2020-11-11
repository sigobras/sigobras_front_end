import React, { Component } from 'react';
import axios from 'axios';
import { FaList, FaChartLine } from "react-icons/fa";
import 'jspdf-autotable';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { Modal, Collapse, Spinner } from 'reactstrap';
import Componentes from './Componentes'
import { Redondea } from "../../../Utils/Funciones"
import ModalListaPersonal from './ModalListaPersonal'
import ModalInformacionObras from '../../../Pgerenciales/InformacionObras/InformacionObra'
import Curva_S from './Curva_S'
import FinancieroBarraPorcentaje from './FinancieroBarraPorcentaje'



class ListaObras extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapse: 95,
            collapseCrono: 56,
            DataComponente: [],
            modalCurvaS: false,
            id_ficha_seleccionado: -1,
            nombreObra_seleccionado: -1,

        }

        this.Setobra = this.Setobra.bind(this);
        this.CollapseComponentes = this.CollapseComponentes.bind(this)
        this.CollapseCronograma = this.CollapseCronograma.bind(this)
    }


    Setobra(idFicha, estado_nombre, codigoObra) {

        sessionStorage.setItem("idobra", idFicha);
        sessionStorage.setItem("estadoObra", estado_nombre);
        sessionStorage.setItem("codigoObra", codigoObra);
        setTimeout(() => { window.location.href = '/inicio' }, 50);

        // switch(estado_nombre) {
        //     case 'Corte':
        //         setTimeout(()=>{ window.location.href = '/MDdiario'},50);            
        //     break;

        //     case 'Actualizacion':
        //         setTimeout(()=>{ window.location.href = '/MDdiario'},50);            
        //     break;

        //     case 'Paralizado':
        //         setTimeout(()=>{ window.location.href = '/ParalizacionObra'},50);
        //     break;

        //     case 'Compatibilidad':
        //         setTimeout(()=>{ window.location.href = '/CompatibilidadObra'},50);
        //     break;

        //     default: 'Ejecucion'
        //         setTimeout(()=>{ window.location.href = '/MDdiario'},50);
        //     break;

        // }
    }


    CollapseComponentes(valor, id_ficha) {
        let event = valor

        this.setState({
            collapse: this.state.collapse === Number(event) ? 95 : Number(event)
            // DataComponente:[]
        });


        if (this.state.collapse !== valor) {

            axios.post(`${UrlServer}/getComponentesPgerenciales`, {
                id_ficha: id_ficha
            })
                .then((res) => {
                    this.setState({
                        DataComponente: res.data
                    })
                })
                .catch((err) =>
                    console.error('error', err)
                )

        }
    }

    CollapseCronograma(index, id_ficha) {

        var indexCollapse = Number(index)

        this.setState({
            collapseCrono: this.state.collapseCrono === indexCollapse ? 56 : indexCollapse,
            // DataComponente:[]
        });

    }
    calcular_dias(fecha_inicio, fecha_final) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(fecha_inicio);
        const secondDate = new Date(fecha_final);
        var days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        return days || 0
    }
    modalCurvaS() {
        this.setState(prevState => ({
            modalCurvaS: !prevState.modalCurvaS
        }));
    }

    render() {
        const { collapse, collapseCrono } = this.state

        return (

            this.props.items.length <= 0 ?
                <tbody><tr><td colSpan="6" className="text-center text-warning"><Spinner color="primary" size="sm" /> </td></tr></tbody> :
                [this.props.items.map((Obras, IndexObras) =>

                    <tbody key={IndexObras}>
                        <tr >
                            <td>{IndexObras + 1}</td>
                            <td style={{
                                color: '#cecece',
                                background: '#242526',
                                fontSize: '0.8rem'


                            }}>{Obras.g_meta}</td>
                            <td style={{ width: '20%' }}>

                                <div style={{
                                    width: '100%',
                                    height: '30px',
                                    textAlign: 'center'
                                }}
                                >

                                    <div style={{
                                        height: '5px',
                                        backgroundColor: '#4a4b4c',
                                        borderRadius: '5px',
                                        position: 'relative',

                                    }}
                                    >
                                        <div
                                            style={{
                                                width: `${Obras.porcentaje_avance}%`,
                                                height: '100%',
                                                boxShadow: '0 0 12px #3578bb',
                                                backgroundColor: Obras.porcentaje_avance > 85 ? '#3578bb'
                                                    : Obras.porcentaje_avance > 30 ? '#8caeda'
                                                        : '#cecece',
                                                borderRadius: '5px',
                                                transition: 'all .9s ease-in',
                                                position: 'absolute',


                                            }}
                                        /><span style={{ position: 'inherit', fontSize: '0.8rem', top: '6px' }}>Físico ({Redondea(Obras.porcentaje_avance)} %)</span>
                                    </div>




                                </div>
                                {/* porcentaje_financiero */}
                                <FinancieroBarraPorcentaje id_ficha={Obras.id_ficha}/>
                            </td>
                            <td style={{
                                color: '#8caeda',
                                background: '#242526',
                                fontSize: '0.8rem'

                            }}>{this.calcular_dias(Obras.ultima_fecha_avance, new Date()) - 1} días sin reportar</td>
                            <td className="text-center">
                                <button className={sessionStorage.getItem("codigoObra") === Obras.codigo ? " btn btn-primary btn-sm text-white " : "btn btn-outline-secondary btn-sm text-white"} onClick={((e) => this.Setobra(Obras.id_ficha, Obras.estado_nombre, Obras.codigo))}>{Obras.codigo}</button>
                            </td>
                            <td className="text-center">
                                <span className={Obras.estado_nombre === "Ejecucion" ? "badge badge-success p-1" : Obras.estado_nombre === "Paralizado" ? "badge badge-warning p-1" : Obras.estado_nombre === "Corte" ? "badge badge-danger p-1" : Obras.estado_nombre === "Actualizacion" ? "badge badge-info p-1" : "badge badge-info p-1"}>{Obras.estado_nombre} </span>
                            </td>
                            <td style={{ width: '12%' }} className="text-center">
                                <button
                                    className="btn btn-outline-info btn-sm mr-1"
                                    title="Avance Componentes"
                                    onClick={() => this.CollapseComponentes(IndexObras, Obras.id_ficha)}
                                    data-event={IndexObras} >
                                    <FaList />
                                </button>
                                <ModalListaPersonal id_ficha={Obras.id_ficha} codigo_obra ={Obras.codigo}/>
                                <ModalInformacionObras idobraSeleccionada={Obras.id_ficha} />
                                <button
                                    className="btn btn-outline-info btn-sm mr-1"
                                    title="Avance Componentes"
                                    onClick={() => { this.modalCurvaS(), this.setState({ id_ficha_seleccionado: Obras.id_ficha, nombreObra_seleccionado: Obras.codigo }) }}
                                    data-event={IndexObras} >
                                    <FaChartLine />
                                </button>

                            </td>
                        </tr>
                        <tr>

                            <td colSpan="6">
                                {collapse === IndexObras ?
                                    <Collapse isOpen={collapse === IndexObras}>
                                        <Componentes DataComponente={this.state.DataComponente} />
                                    </Collapse>
                                    : ''}
                            </td>
                        </tr>
                    </tbody>
                ),
                <Modal
                    isOpen={this.state.modalCurvaS}
                    fade={false}
                    toggle={() => this.modalCurvaS()}
                    size="lg"
                >
                    <Curva_S id_ficha={this.state.id_ficha_seleccionado} nombreObra={this.state.nombreObra_seleccionado} />
                </Modal>
                ]
        )
    }
}
export default ListaObras;
