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
import titulos from '../../../data/titulos';
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
            loadReportData();
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
                            <TableCell
                                className={classes.header}
                                style={{ minWidth: 40 }}
                            >N°</TableCell>
                            {titulos.map((titulo) => (
                                <TableCell
                                    key={titulo.value}
                                    className={classes.header}
                                    style={{ minWidth: titulo.minWidth }}
                                >
                                    {titulo.nombre}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {Datos.map((row, index) => (
                            <TableRow key={index}>
                                <TableCellEditable
                                    value={index + 1}
                                    disabled
                                    onChange={(e) =>
                                        handleChange(e, index, e.target.value, row.id)
                                    }
                                />
                                {titulos.map((titulo) => (
                                    <TableCellEditable
                                        key={titulo.value}
                                        value={row[titulo.value]}
                                        disabled={titulo.readOnly}
                                        onChange={(e) =>
                                            handleChange(e, index, titulo.value, row.id)
                                        }
                                    />
                                ))}
                            </TableRow>
                        ))}
                        {/* <TableRow>
                        <TableCell>
                            <Button
                                className={classes.button}
                                onClick={handleAddRow}
                            />
                        </TableCell>
                    </TableRow> */}
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    );
};

export default ReportTable;
