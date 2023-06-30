import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { FaList } from "react-icons/fa";
import {
  fechaFormatoClasico,
  hexToRgb,
  Redondea,
} from "../../js/components/Utils/Funciones";
import CarouselNavs from "../../js/components/Inicio/Carousel/CarouselNavs";
import CurvaS from "../../js/components/Inicio/Cuva_S";
import PhysicalPercentageBar from "../../js/components/Inicio/FisicoBarraPorcentaje";
import FinancialPercentageBar from "../../js/components/Inicio/FinancieroBarraPorcentaje";
import ModalListaPersonal from "../../js/components/Inicio/ListaPersonal";
import ObrasLabelsEdicion from "../../js/components/Inicio/Obras_labels_edicion";
import { UrlServer } from "../../utils/ServerUrlConfig";
import { makeStyles, useTheme } from "@mui/styles";
import ProgressBar from "../organisms/ProgressBar";
import OutlinedLabel from "../organisms/OutlinedLabel";
import PlazosInfo from "../organisms/PlazosInfo";
import ObrasLabels from "../organisms/ObrasLabels";
import PersonalComponent from "../organisms/PersonalComponent";
import FormObreros from "../organisms/FormObreros";
const ObrasTable = ({ obras }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const calculateDays = (start, end) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.round(Math.abs((startDate - endDate) / oneDay));
    return days || 0;
  };

  const setSelectedWorkHandler = (data) => {
    sessionStorage.setItem("selectedWork", data);
    dispatch(setSelectedWork(data));
  };

  const useStyles = makeStyles(() => ({
    container: {
      display: "flex",
      alignItems: "center",
      margin: 0,
      padding: 0,
    },
    label: {
      color: "#17a2b8",
      marginRight: "5px",
      fontSize: "12px",
    },
    text: {
      fontSize: "14px",
      whiteSpace: "nowrap", // Add this line
    },
    tableCell: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    tableCellFecha: {
      paddingTop: 4,
      paddingBottom: 4,
      whiteSpace: "nowrap", // Add this line
    },
  }));

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">N°</TableCell>
            <TableCell>OBRA</TableCell>
            <TableCell align="center">ESTADO</TableCell>
            <TableCell align="center">UDM</TableCell>
            <TableCell align="center">AVANCE</TableCell>
            <TableCell align="center">OPCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {obras.map((item, i) => (
            <React.Fragment key={item.id_ficha}>
              {(i === 0 ||
                (i > 0 &&
                  item.unidad_ejecutora_nombre !==
                    obras[i - 1].unidad_ejecutora_nombre)) && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    style={{
                      color: "#cecece",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                    }}
                  >
                    {item.unidad_ejecutora_nombre}
                  </TableCell>
                </TableRow>
              )}
              {(i === 0 ||
                item.unidad_ejecutora_nombre !==
                  obras[i - 1].unidad_ejecutora_nombre ||
                (i > 0 &&
                  item.sector_nombre !== obras[i - 1].sector_nombre)) && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    style={{
                      color: "#ffa500",
                      fontSize: "1rem",
                      fontWeight: "700",
                    }}
                  >
                    {item.sector_nombre}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className={classes.tableCell}>{i + 1}</TableCell>
                <TableCell className={classes.tableCell}>
                  <OutlinedLabel
                    color={"white"}
                    name={item.codigo}
                    onClick={() => setSelectedWorkHandler(item)}
                  />

                  {item.g_meta + "/CUI - " + item.codigo_unificado}
                  <div>
                    <span
                      style={{
                        color: theme.palette.primary.main,
                      }}
                    >
                      PRESUPUESTO S./{Redondea(item.g_total_presu)}
                    </span>{" "}
                    <span
                      style={{
                        color: theme.palette.secondary.main,
                      }}
                    >
                      SALDO FINANCIERO S./
                      {Redondea(
                        item.g_total_presu - item.avancefinanciero_acumulado
                      )}
                    </span>{" "}
                    <span
                      style={{
                        color: theme.palette.primary.main,
                      }}
                    >
                      PIM 2021 S./
                      {Redondea(item.pim_anyoactual)}
                    </span>{" "}
                    <span
                      style={{
                        color: theme.palette.secondary.main,
                      }}
                    >
                      META 2021 -{item.meta_anyoactual}
                    </span>
                  </div>
                  <PlazosInfo item={item} />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <OutlinedLabel
                    color={item.estadoobra_color}
                    name={item.estadoobra_nombre}
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCellFecha}>
                  {calculateDays(item.avancefisico_ultimafecha, new Date()) - 1}{" "}
                  dias
                  <div>
                    {fechaFormatoClasico(item.avancefisico_ultimafecha)}
                  </div>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <ProgressBar
                    tipo="barra"
                    avance={item.avancefisico_acumulado}
                    total={item.presupuesto_costodirecto}
                    color={theme.palette.primary.main}
                    tipoProgreso="Fisico"
                  />
                  <ProgressBar
                    tipo="barra"
                    avance={item.avancefinanciero_acumulado}
                    total={item.g_total_presu}
                    color={theme.palette.secondary.main}
                    tipoProgreso="Financiero"
                  />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <div className={classes.container}>
                    <button
                      className={`btn btn-outline-info btn-sm ${classes.button}`}
                      title="Component Progress"
                      onClick={() =>
                        onChangeObraComponentesSeleccionada(item.id_ficha)
                      }
                    >
                      <FaList />
                    </button>
                    <PersonalComponent
                      id_ficha={item.id_ficha}
                      codigo_obra={item.codigo}
                    />
                    <FormObreros id_ficha={item.id_ficha} />
                  </div>

                  <div className="d-flex">
                    <CurvaS Obra={item} />
                    <ObrasLabelsEdicion
                      id_ficha={item.id_ficha}
                      codigo={item.codigo}
                    />
                    <CarouselNavs
                      id_ficha={item.id_ficha}
                      codigo={item.codigo}
                    />
                  </div>
                </TableCell>
              </TableRow>
              {/* <TableRow>
                <TableCell
                  style={{ borderTop: "none" }}
                  colSpan={8}
                  className={classes.tableCell}
                >
                  <ObrasLabels id_ficha={item.id_ficha} />
                </TableCell>
              </TableRow> */}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ObrasTable;
