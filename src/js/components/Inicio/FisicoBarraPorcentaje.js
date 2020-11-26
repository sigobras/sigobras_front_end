import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea } from '../Utils/Funciones';
export default ({ id_ficha }) => {
    useEffect(() => {
        fetchFisicoAvance()

    }, []);

    const [FisicoAvance, setFisicoAvance] = useState({fisico_avance_porcentaje:0});
    async function fetchFisicoAvance() {
        const request = await axios.post(`${UrlServer}/getFisico`, {
            "id_ficha": id_ficha
        })
        setFisicoAvance(request.data)
    }
    return (
        <div style={{
            width: '100%',
            height: '20px',
            textAlign: 'center'
        }}
        >
            {/* {id_ficha} */}
            <div style={{
                height: '5px',
                backgroundColor: '#4a4b4c',
                borderRadius: '5px',
                position: 'relative'
            }}
            >
                <div
                    style={{
                        width: `${FisicoAvance.fisico_avance_porcentaje}%`,
                        height: '100%',
                        boxShadow: '0 0 12px #3578bb',
                        backgroundColor: FisicoAvance.fisico_avance_porcentaje > 85 ? '#3578bb'
                            : FisicoAvance.fisico_avance_porcentaje > 30 ? '#8caeda'
                                : '#cecece',
                        borderRadius: '5px',
                        transition: 'all .9s ease-in',
                        position: 'absolute',
                    }}
                />
                <span
                    style={{
                        position: 'inherit',
                        fontSize: '0.7rem',
                        top: '6px',
                        color: '#8caeda'
                    }}
                >
                    Fisico ({Redondea(FisicoAvance.fisico_avance_porcentaje)} %)
                </span>
            </div>

        </div>
    );
}
