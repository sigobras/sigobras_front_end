import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    CircularProgress,
    Box,
} from '@mui/material';
import reporte from '../../../interfaces/reporteMonitoreo';
import { titulos, estructuraTitulos } from '../../../data/titulos';
import TableCellEditable from '../../molecules/TableCellEditable';
import Button from '../../atoms/Button';
import {
    getReportData,
    addRow,
    updateData,
} from '../../../services/reportMonitoreoService';
import useStyles from './tableStyles';
const ReportTable: React.FC = () => {
    const classes = useStyles();

    const [Datos, setDatos] = useState<reporte[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadReportData();
    }, []);

    async function loadReportData() {
        setLoading(true);
        try {
            const res = await getReportData();
            setDatos(res);
        } catch (error) {
            console.error('error', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddRow() {
        try {
            await addRow();
        } catch (error) {
            console.error('error', error);
        }
    }

    const saveData = debounce(async (newData, fieldName, id, value) => {
        await updateData(id, { [fieldName]: value });
        setDatos(newData);
    }, 100);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        fieldName: string,
        id: number,
    ) => {
        const newData = [...Datos];
        const value = e.target.value;
        newData[index][fieldName] = value;
        saveData(newData, fieldName, id, value);
    };

    function getFormattedData(colLabel: string, format: string, indice: number) {
        type CalculationFunctions = {
            [key: string]: () => string | number;
            pia: () => "Con Pia" | "Sin PiA";
            total_cemento: () => number;
            saldo: () => number;
            expediente_1: () => number;
            expediente_2: () => number;
        };

        const calculations: CalculationFunctions = {
            pia: () => Datos[indice].pia_2023 > 0 ? 'Con Pia' : 'Sin PiA',
            total_cemento: () => Number(Datos[indice].cantidad_cemento) + Number(Datos[indice].cantidad_vencidos_cemento),
            saldo: () => Number(Datos[indice].pim) - Number(Datos[indice].total_certificado),
            expediente_1: () => Number(Datos[indice].expediente),
            expediente_2: () => Number(Datos[indice].expediente),

        };

        if (format === 'porcentaje') {
            return agregarPorcentaje(Datos[indice][colLabel])
        }
        if (format === 'money') {
            return agregarFormatoNumero(Datos[indice][colLabel])
        }

        return calculations[colLabel]
            ? calculations[colLabel]()
            : Datos[indice][colLabel];
    }

    function agregarPorcentaje(str: any) {
        if (isNaN(parseFloat(str))) {
            return '0%'; // si no es un número, devuelve '0%'
        }
        return str.endsWith('%') ? str : str + '%'; // si ya tiene '%', devuelve el string original, de lo contrario agrega '%'
    }

    function agregarFormatoNumero(numero: any) {
        if (numero == null) {
            return 0;
        }

        // Extraer la parte entera y la parte decimal del número
        let [parteEntera, parteDecimal] = numero.toString().match(/^([\d,.]+)(?:\.(\d{2}))?$/).slice(1);

        // Reemplazar todas las comas y puntos por un punto
        parteEntera = parteEntera.replace(/[,.]/g, '.');

        // Agregar comas de formato a la parte entera
        parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Combinar la parte entera y la parte decimal con un punto
        let resultado = parteEntera;
        if (parteDecimal != null) {
            resultado += '.' + parteDecimal;
        }

        return resultado;
    }

    function getFormattedValue(label: string | number, format: string) {
        if (format === 'porcentaje') {
            return agregarPorcentaje(label)
        }
        if (format === 'money') {
            return agregarFormatoNumero(label)
        }
        return label || ''
    }


    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Button
                className={classes.button}
                onClick={handleAddRow}
            />
            <TableContainer >
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                estructuraTitulos.nivel_1.map((titulo) => (
                                    <TableCell
                                        key={titulo.nombre}
                                        className={classes.header}
                                        colSpan={titulo.colspan}
                                        rowSpan={titulo.rowspan}
                                        style={{ minWidth: titulo.minWidth }}
                                    >
                                        {titulo.nombre}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                        <TableRow>
                            {
                                estructuraTitulos.nivel_2.map((titulo) => (
                                    <TableCell
                                        key={titulo.nombre}
                                        className={classes.header}
                                        style={{ minWidth: titulo.minWidth }}
                                    >
                                        {titulo.nombre}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {Datos.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell
                                    className={classes.disabled}
                                >
                                    {index + 1}
                                </TableCell>

                                {titulos.map((titulo) => (

                                    titulo.readOnly ?
                                        <TableCell
                                            key={row.id + titulo.value}
                                            className={classes.disabled}
                                        >
                                            {getFormattedData(titulo.value, titulo.format, index)}
                                        </TableCell>
                                        :
                                        <TableCellEditable
                                            key={titulo.value}
                                            // value={titulo.format === 'porcentaje' ? agregarPorcentaje(row[titulo.value] || '')  : row[titulo.value] || ''}
                                            value={getFormattedValue(row[titulo.value], titulo.format)}
                                            disabled={titulo.readOnly}
                                            onChange={(e) =>
                                                handleChange(e, index, titulo.value, row.id)
                                            }
                                            type={titulo.type}
                                        />

                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>

    );
};

export default ReportTable;
