import React, { useState } from 'react'
import HistorialMetrados from '../HistorialMetrados/HistorialMetrados';
import { MdRemove, MdAdd } from 'react-icons/md';
import { CardHeader, Card, Collapse, CardBody } from 'reactstrap';

function MDHistorial() {
    const [MetDiarios, setMetDiarios] = useState();
    const [PartidasNuevas, setPartidasNuevas] = useState();
    const [MayoresMet, setMayoresMet] = useState();
    const [Collaps, setCollaps] = useState(1);

    const CollapsCard = (valor) => {
        var abrir = Collaps === valor?null:valor
        setCollaps(abrir)
    }
    
    if (sessionStorage.getItem("idacceso") !== null) {
        return (
            <div className="pb-3">
                <Card>
                    <a href="#" className="text-white text-decoration-none">
                        <CardHeader onClick={() => CollapsCard(1)} >
                            <b>METRADOS DIARIOS</b>
                            <div className="float-right">
                                {Collaps === 1 ? <MdRemove size={20} /> : <MdAdd size={20} />}
                            </div>
                        </CardHeader>
                    </a>
                    <Collapse isOpen={Collaps === 1}>
                        <CardBody>
                            {/* <HistorialMetrados rutas={MetDiarios} /> */}
                            {Collaps ===  1? <HistorialMetrados rutas={PartidasNuevas} /> : null}
                        </CardBody>
                    </Collapse>
                </Card>
{/* 
                <Card className="mt-2">
                    <a href="#" className="text-white text-decoration-none">
                        <CardHeader onClick={() => CollapsCard(2)} >
                            <b>PARTIDAS NUEVAS</b>
                            <div className="float-right">
                                {Collaps === 2 ? <MdRemove size={20} /> : <MdAdd size={20} />}
                            </div>
                        </CardHeader>
                    </a>
                    <Collapse isOpen={Collaps === 2}>
                        <CardBody>
                            {Collaps === 2 ? <HistorialMetrados rutas={PartidasNuevas} /> : null}
                        </CardBody>
                    </Collapse>
                </Card>

                <Card className="mt-2">
                    <a href="#" className="text-white text-decoration-none">
                        <CardHeader onClick={() => CollapsCard(3)} >
                            <b>MAYORES METRADOS</b>
                            <div className="float-right">
                                {Collaps === 3 ? <MdRemove size={20} /> : <MdAdd size={20} />}
                            </div>
                        </CardHeader>
                    </a>
                    <Collapse isOpen={Collaps === 3}>
                        <CardBody>
                            {Collaps === 3 ? <HistorialMetrados rutas={MayoresMet} /> : null}
                        </CardBody>
                    </Collapse>
                </Card> */}

            </div>
        );
    } else {
        return window.location.href = '/'
    }
}

export default MDHistorial
