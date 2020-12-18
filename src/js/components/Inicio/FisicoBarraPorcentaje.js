import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea } from '../Utils/Funciones';
import { Button, Input, Tooltip } from 'reactstrap';
export default ({ id_ficha }) => {
    useEffect(() => {
        fetchFisicoAvance()

    }, []);

    const [FisicoAvance, setFisicoAvance] = useState({ fisico_avance_porcentaje: 0 });
    async function fetchFisicoAvance() {
        const request = await axios.post(`${UrlServer}/getFisico`, {
            "id_ficha": id_ficha
        })
        setFisicoAvance(request.data)
    }
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <div style={{
            width: '100%',
            height: '20px',
            textAlign: 'center',
            "padding-bottom": "28px"
        }}
        >
            <div style={{
                height: '2px',
                backgroundColor: '#4a4b4c',
                borderRadius: '5px',
                position: 'relative'
            }}
            >
                <div
                    style={{
                        width: `${FisicoAvance.fisico_avance_porcentaje}%`,
                        height: '100%',
                        backgroundColor: "#17a2b8",
                        borderRadius: '5px',
                        transition: 'all .9s ease-in',
                        position: 'absolute',
                    }}
                />
                <span
                    style={{
                        position: 'inherit',
                        top: '6px',
                        color: '#8caeda',
                        "font-size": "12px",
                        color: "#ffffff",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center"
                    }}
                    id={"FisicoBarraPorcentaje-" + id_ficha}
                >
                    Físico
                    <div
                        style={{
                            "font-size": "13px"
                        }}
                    >-({Redondea(FisicoAvance.fisico_avance_porcentaje)} %)</div>
                </span>
                <Tooltip
                    placement={"bottom"}
                    isOpen={tooltipOpen}
                    target={"FisicoBarraPorcentaje-" + id_ficha}
                    toggle={toggle}
                >
                    S/.{Redondea(FisicoAvance.fisico_avance)}
                </Tooltip>
            </div>

        </div>
    );
}
