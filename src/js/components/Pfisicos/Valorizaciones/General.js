import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import ValorizacionGeneral from './ComponentsValorizaciones/ValorizacionGeneral'

class General extends Component {
    constructor(){
        super();
        
        this.state = {
            // COLLAPSE DE BOTONES
            collapse: 1,
            ValRutaGeneral:{
                    Anios:"/getValGeneralAnyos",
                    Mes:"/",
                    ResumenComp:"/getValGeneralResumenPeriodo",
                    Componentes:"/",
                    Partidas:"/getValGeneralPartidas"
            },

            ValRutaPartidaNeva:{
                    Anios:"/getValGeneraPartidaNuevalAnyos",
                    Mes:"/",
                    ResumenComp:"",
                    Componentes:"/getValGeneralPartidaNuevaResumenPeriodo",
                    Partidas:"/getValGeneralPartidaNuevaPartidas"
            },

            ValRutaMayorMetrado:{
                    Anios:"/getValGeneraMayoresMetradoslAnyos",
                    Mes:"/",
                    ResumenComp:"",
                    Componentes:"/",
                    Partidas:"/getValGeneralMayoresMetradosPartidas"
            },
        }; 

        this.CollapseCard = this.CollapseCard.bind(this)
    }

    CollapseCard(valor){
        let event = valor
        
        // this.setState({ collapse: this.state.collapse === Number(event) ? 1 : Number(event) });
        this.setState({ collapse: this.state.collapse === Number(event) ? 1995 : Number(event) });
    }

    render() {
        const { collapse } = this.state
        return ( 
            
            <div>
                {/* LLAMA AL COMPONETE DEVALORIZACION GENERAL */}
                <Card>
                    <CardHeader onClick={e=>this.CollapseCard(1)} data-event={1} className="font-weight-bold">
                        VALORIZACION GENERAL {collapse === 1?'➖':'➕'}
                    </CardHeader>
                    <Collapse isOpen={collapse === 1}>
                        { collapse === 1 ? <ValorizacionGeneral Ruta = { this.state.ValRutaGeneral }/> : '' }
                    </Collapse>
                </Card>

                {/* LLAMA A OTRO COMPONETE DE PARTIDAS NUEVAS */}
                <Card className="mt-2">
                    <CardHeader onClick={e=>this.CollapseCard(2)} data-event={2}  className="font-weight-bold">
                        VALORIZACION DE PARTIDAS NUEVAS {collapse === 2?'➖':'➕'}
                    </CardHeader>
                    <Collapse isOpen={collapse === 2}>
                        <CardBody>
                            { collapse === 2 ? <ValorizacionGeneral Ruta = { this.state.ValRutaPartidaNeva } />: '' }
                        </CardBody>                   
                    </Collapse>
                </Card>

                {/* LLAMA AL COMPONENTE DE MAYORES METRADOS EN VALORIZACIONES */}
                <Card className="mt-2">
                    <CardHeader onClick={e=>this.CollapseCard(3)} data-event={3} className="font-weight-bold">
                         VALORIZACION DE MAYORES METRADOS {collapse === 3?'➖':'➕'}
                    </CardHeader>
                    <Collapse isOpen={collapse === 3}>
                        <CardBody>
                            { collapse === 3 ? <ValorizacionGeneral Ruta = { this.state.ValRutaMayorMetrado } /> : '' }
                        </CardBody>                   
                    </Collapse>
                </Card>
            </div>
        );
  }
}

export default General;