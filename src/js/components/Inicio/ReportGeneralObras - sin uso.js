import React, { useState, useEffect } from "react";
import { Button, Table } from "reactstrap";
import { UrlServer } from "../Utils/ServerUrlConfig";
import axios from "axios";
import * as pdfmake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { logoSigobras, logoGRPuno } from "../Reportes/Complementos/ImgB64";
import { Redondea } from "../Utils/Funciones";
import { FaFilePdf } from "react-icons/fa";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

export default () => {
  const [Loading, setLoading] = useState(false);
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));
  const classes = useStyles();
  async function fetchDataObras() {
    setLoading(true);
    let res = await axios.post(`${UrlServer}/listaObrasByIdAcceso`, {
      id_acceso: sessionStorage.getItem("idacceso"),
    });
    var obras = res.data;
    for (let i = 0; i < obras.length; i++) {
      const element = obras[i];
      const imagenes = await axios.post(`${UrlServer}/getImagenesCurvaS`, {
        id_ficha: element.id_ficha,
        cantidad: 2,
      });

      if (imagenes.data.length == 2) {
        obras[i].imagen_db1 = await ImagenToBase64(imagenes.data[0].imagen);
        obras[i].imagen_db2 = await ImagenToBase64(imagenes.data[1].imagen);
      } else {
        obras[i].imagen_db1 = logoSigobras;
        obras[i].imagen_db2 = logoSigobras;
      }

      const financiero = await axios.post(`${UrlServer}/getFinanciero`, {
        id_ficha: element.id_ficha,
      });
      obras[i].financiero_avance_porcentaje =
        financiero.data.financiero_avance_porcentaje;
      const fisico = await axios.post(`${UrlServer}/getFisico`, {
        id_ficha: element.id_ficha,
      });
      obras[i].fisico_avance_porcentaje = fisico.data.fisico_avance_porcentaje;
    }
    // console.log("Obras", obras);
    setLoading(false);
    return obras;
  }
  async function ImagenToBase64(url) {
    var urlFinal = UrlServer + url;
    let image = await axios.get(urlFinal, {
      responseType: "arraybuffer",
    });

    var raw = Buffer.from(image.data).toString("base64");
    var imgb64 = "data:" + image.headers["content-type"] + ";base64," + raw;
    return imgb64;
  }
  async function fetchGlobalPdf() {
    var DataObras = await fetchDataObras();
    var ObrasPdf = [];
    for (let i = 0; i < DataObras.length; i++) {
      const element = DataObras[i];
      ObrasPdf.push(
        [
          {
            text: "PROYECTO EN EJECUCION - SECTOR " + element.sector_nombre,
            alignment: "center",
            margin: [0, 0, 0, 15],
          },
          {
            style: "tableExample",
            layout: "noBorders",
            table: {
              widths: [40, "*"],
              dontBreakRows: true,

              body: [
                [
                  {
                    text: element.codigo_unificado,
                    fillColor: "#204d7b",
                    color: "yellow",
                    bold: true,
                    margin: [5, 0, 0, 0],
                  },
                  {
                    text: element.g_meta,
                    fillColor: "#204d7b",
                    color: "white",
                    bold: true,
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            table: {
              // dontBreakRows: true,
              body: [[{ text: "", border: [false, false, false, false] }]],
            },
          },
        ],
        [
          // {
          //     canvas: [
          //         {
          //             type: 'rect',
          //             x: 0,
          //             y: 0,
          //             w: 285,
          //             h: 130,
          //             r: 5,
          //             lineColor: 'black',
          //         },
          //     // layout: 'headerLineOnly',
          //     // absolutePosition: {x: 45, y: 50}
          //     ]
          // },
          {
            style: "tableExample",
            layout: "noBorders",
            table: {
              // dontBreakRows: true,
              widths: ["*", 200, 200],
              body: [
                [
                  {
                    text: "META",
                    color: "#086eb7",
                  },

                  {
                    image: element.imagen_db1,
                    rowSpan: 4,
                    // width: 90,
                    // height: 90,
                    fit: [200, 200],
                    alignment: "center",
                  },

                  {
                    image: element.imagen_db2,
                    rowSpan: 4,
                    // width: 200,
                    // height: 200,
                    fit: [200, 200],
                    alignment: "center",
                  },
                ],
                [
                  {
                    text: element.meta_final || "Descripcion",
                    color: "#26315a",
                  },
                  { text: "" },
                  { text: "" },
                ],
                [
                  {
                    text: "POBLACION BENEFICIARIA",
                    color: "#086eb7",
                  },
                  { text: "" },
                  { text: "" },
                ],
                [
                  {
                    text: element.poblacion_beneficiaria || "Descripcion",
                    color: "#26315a",
                  },
                  { text: "" },
                  { text: "" },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            table: {
              // dontBreakRows: true,
              body: [[{ text: "", border: [false, false, false, false] }]],
            },
          },
        ],
        [
          {
            style: "tableExample",
            layout: "noBorders",
            table: {
              // dontBreakRows: true,

              widths: [130, "auto", 30, 170, "*"],
              body: [
                [
                  {
                    text: "PRESUPUESTO : ",
                    fillColor: "#086eb7",
                    color: "yellow",
                    bold: true,
                    margin: [5, 0, 0, 0],
                  },
                  {
                    text: "S/. " + Redondea(element.g_total_presu),
                    fillColor: "#086eb7",
                    color: "white",
                    bold: true,
                  },
                  { text: "", border: [false, false, false, false] },
                  {
                    text: "AVANCE FINANCIERO ACUMULADO 2020 ",
                    fillColor: "#086eb7",
                    color: "yellow",
                    bold: true,
                  },
                  {
                    text: Redondea(element.financiero_avance_porcentaje) + " %",
                    fillColor: "#086eb7",
                    color: "white",
                    bold: true,
                  },
                ],

                [
                  {
                    text: "",
                    border: [false, false, false, false],
                    colSpan: 5,
                  },
                ],

                [
                  {
                    text: "MODALIDAD DE EJECUCION : ",
                    fillColor: "#086eb7",
                    color: "yellow",
                    bold: true,
                    margin: [5, 0, 0, 0],
                  },
                  {
                    text: element.tipoadministracion_nombre,
                    fillColor: "#086eb7",
                    color: "white",
                    bold: true,
                  },
                  { text: "", border: [false, false, false, false] },
                  {
                    text: "AVANCE FISICO ACUMULADO 2020 ",
                    fillColor: "#086eb7",
                    color: "yellow",
                    bold: true,
                  },
                  {
                    text: Redondea(element.fisico_avance_porcentaje) + " %",
                    fillColor: "#086eb7",
                    color: "white",
                    bold: true,
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            table: {
              // dontBreakRows: true,
              body: [
                [
                  {
                    text: "",
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 15],
                    pageBreak:
                      (i + 1) % 2 == 0 && i < DataObras.length - 1 && "before",
                  },
                ],
              ],
            },
          },
        ]
      );
    }

    var dd = {
      header: {
        columns: [
          {
            image: logoGRPuno,
            fit: [280, 280],
            margin: [45, 4, 10, 0],
          },
          {
            alignment: "right",
            image: logoSigobras,
            width: 48,
            height: 30,
            margin: [20, 4, 10, 0],
          },
        ],
      },
      content: ObrasPdf,
      // pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      //     return currentNode.startPosition.top >= 700;
      // },
      pageSize: "A4",
      // pageOrientation: 'portrait'
      // pageOrientation: 'landscape',
      defaultStyle: {
        alignment: "justify",
        fontSize: 9,
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var win = window.open("", "_blank");
    pdfMake.createPdf(dd).open({}, win);
    // setLoading(false);
  }

  return (
    <Button
      outline
      color="success"
      onClick={() => {
        if (confirm("Desea generar el reporte de todas las obras?")) {
          fetchGlobalPdf();
        }
      }}
    >
      <FaFilePdf />
      {Loading && (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Button>
  );
};
