import React, { Component } from "react";
import axios from "axios";
import * as pdfmake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Button,
  ButtonGroup,
  Spinner,
} from "reactstrap";
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from "../Complementos/HeaderInformes";
import { logoSigobras, logoGRPuno } from "../Complementos/ImgB64";
import { UrlServer } from "../../Utils/ServerUrlConfig";

class Report_1 extends Component {
  constructor() {
    super();
    this.state = {
      DataHistorialApi: [],
      DataAniosApi: [],
      DataMesesApi: [],

      modal: false,
      DataEncabezado: [],
      urlPdf: "",
      anioSeleccionado: "",
      cSelected: "",

      Loading: false,
    };

    this.ModalReportes = this.ModalReportes.bind(this);
    this.makePdf = this.makePdf.bind(this);
    this.seleccionaAnios = this.seleccionaAnios.bind(this);
    this.seleccionaMeses = this.seleccionaMeses.bind(this);
    //this.onRadioBtnClick = this.onRadioBtnClick.bind(this)
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  // onRadioBtnClick(rSelected) {
  //   this.setState({ rSelected });
  // }

  onCheckboxBtnClick(selected) {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

  ModalReportes() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    // llama al api de años
    axios
      .post(`${UrlServer}/getAnyoReportes`, {
        id_ficha: sessionStorage.getItem("idobra"),
      })
      .then((res) => {
        //console.log('res ANIOS', res.data)
        this.setState({
          DataAniosApi: res.data,
        });
      })
      .catch((err) => {
        console.log("ERROR ANG al obtener datos ❌" + err);
      });
  }

  seleccionaAnios(e) {
    // LLAMA AL API DE MESES

    this.setState({
      anioSeleccionado: e.target.value,
    });

    axios
      .post(`${UrlServer}/getPeriodsByAnyo`, {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: e.target.value,
      })
      .then((res) => {
        //console.log('res Meses', res.data)
        this.setState({
          DataMesesApi: res.data,
        });
      })
      .catch((err) => {
        console.log("ERROR ANG al obtener datos ❌" + err);
      });
  }

  seleccionaMeses(fecha_inicial, fecha_final, mes_act, rSelected) {
    this.setState({ rSelected });
    this.setState({
      mesActual: mes_act,
      Loading: true,
    });
    // LLAMA AL API DE MESES
    axios
      .post(`${UrlServer}/CuadroMetradosEjecutados`, {
        id_ficha: sessionStorage.getItem("idobra"),

        fecha_inicial: fecha_inicial,
        fecha_final: fecha_final,
      })
      .then((res) => {
        // console.log('res CuadroMetradosEjecutados', res.data)

        this.setState({
          DataHistorialApi: res.data,
          DataEncabezado: encabezadoInforme(fecha_inicial, fecha_final),
          Loading: false,
        });
      })
      .catch((err) => {
        console.log("ERROR ANG al obtener datos ❌" + err);
      });
  }

  makePdf() {
    var { DataEncabezado } = this.state;

    //ARMAMOS DATA PARA GENERAR EL PDF DE METRADOS EJECUTADOS

    var DataHist = this.state.DataHistorialApi;
    // console.log('DH', DataHist)
    var ArFormat = [];

    for (let i = 0; i < DataHist.length; i++) {
      ArFormat.push({
        style: "tableExample",
        // color: '#ff0707',
        layout: "lightHorizontalLines",
        table: {
          headerRows: 2,
          widths: [40, "*", "auto", 50, 40, 100],
          //pageBreak: 'before',

          body: [
            [
              {
                text: "C -" + DataHist[i].numero,
                style: "TableMontosInforme",
                alignment: "center",
                margin: [5, 0, 0, 0],
              },
              {
                text: DataHist[i].nombre_componente,
                style: "TableMontosInforme",
                alignment: "center",
                colSpan: 4,
              },
              {},
              {},
              {},
              // {

              // },
              // {

              // },
              {
                text: "S/." + DataHist[i].componente_total_soles,
                style: "TableMontosInforme",
                alignment: "center",
                margin: [0, 0, 5, 0],
              },
            ],

            // ---------------------
            // contenido

            [
              {
                text: "ITEM",
                style: "tableHeader",
                alignment: "center",
                margin: [5, 0, 0, 0],
              },
              {
                text: "PARTIDA",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: "ACTIVIDAD",
                style: "tableHeader",
                alignment: "center",
              },

              {
                text: "EJECUTADO",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: "S/. C / U",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: "S/. TOTAL",
                style: "tableHeader",
                alignment: "center",
                margin: [0, 0, 5, 0],
              },
            ],
          ],
        },
        pageBreak: "after",
      });
      // console.log('ArFormat', ArFormat[0].table.body)

      for (let j = 0; j < DataHist[i].fechas.length; j++) {
        // console.log(i, 'dhssss', DataHist[i].fechas[j].fecha, 'index j', j)

        ArFormat[i].table.body.push(
          // .........................
          [
            {
              text: DataHist[i].fechas[j].fecha_larga,
              style: "tableFecha",
              alignment: "center",
              colSpan: 5,
              margin: [5, 0, 0, 0],
            },
            {},
            {},
            {},
            {},
            // {

            // },
            // {

            // },
            {
              text: "S/. " + DataHist[i].fechas[j].fecha_total_soles,
              style: "tableFecha",
              alignment: "right",
              //margin:[0,0,5,0],
            },
          ]
        );

        // console.log('ArFormat2', ArFormat[i].table.body)

        for (let k = 0; k < DataHist[i].fechas[j].historial.length; k++) {
          ArFormat[i].table.body.push(
            [
              {
                text: DataHist[i].fechas[j].historial[k].item,
                style: "tableBody",
                // alignment: 'center'
                margin: [5, 0, 0, 0],
              },
              {
                text: DataHist[i].fechas[j].historial[k].descripcion_partida,
                style: "tableBody",
                // alignment: 'center'
              },
              {
                text: DataHist[i].fechas[j].historial[k].nombre_actividad,
                style: "tableBody",
              },
              {
                text:
                  DataHist[i].fechas[j].historial[k].valor +
                  " " +
                  DataHist[i].fechas[j].historial[k].unidad_medida,
                style: "tableBody",
                alignment: "center",
              },
              {
                text: DataHist[i].fechas[j].historial[k].costo_unitario,
                style: "tableBody",
                alignment: "center",
              },
              {
                text: DataHist[i].fechas[j].historial[k].parcial,
                style: "tableBody",
                alignment: "center",
                margin: [0, 0, 5, 0],
              },
            ],
            [
              {
                text: DataHist[i].fechas[j].historial[k].observacion,
                style: "tableBody",
                //alignment: 'center',
                colSpan: 6,
              },
              {},
              {},

              {},
              {},
              {},
            ]
          );
        }
      }
    }

    var ultimoElemento = ArFormat.length - 1;
    delete ArFormat[ultimoElemento].pageBreak;

    //console.log("ArFormat", ArFormat);

    // GENERA EL FORMATO PDF
    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = {
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

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: currentPage.toString() + " de " + pageCount,
              margin: [45, 4, 10, 0],
              fontSize: 7,
            },
            {
              qr: "http://sigobras.com",
              fit: 30,
              alignment: "right",
              margin: [20, 0, 10, 0],
            },
          ],
        };
      },

      content: [
        {
          layout: "noBorders",
          margin: 7,
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text:
                    "CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales)",
                  style: "tableFechaContent",
                  alignment: "center",
                  margin: [10, 0, 5, 0],
                },
              ],
            ],
          },

          // text: 'CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales)',
          // margin: 7,
          // alignment: 'center',
          //strokeColor: '#babfc7',
          //color:'#ff0000',
        },

        DataEncabezado,
        ArFormat,
      ],

      styles: {
        header: {
          fontSize: 7,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 8.5,
          color: "#000000",
          fillColor: "#8baedb",
        },
        tableFecha: {
          bold: true,
          fontSize: 9,
          color: "#000000",
          fillColor: "#edf1f4",
        },
        tableBody: {
          // bold: true,
          fontSize: 6,
          color: "#000000",
          // fillColor: '#f6f6ff',
        },
        TableHeaderInforme: {
          bold: true,
          fontSize: 7,
          color: "#000000",
          // fillColor: '#ffcf96',
        },
        TableMontosInforme: {
          bold: true,
          fontSize: 9,
          color: "#FFFFFF",
          fillColor: "#3a68af",
        },
        tableBodyInforme: {
          fontSize: 7,
          color: "#000000",
        },
        tableFechaContent: {
          bold: true,
          fontSize: 10,
          color: "#000000",
          fillColor: "#8baedb",
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageSize: "A4",
      pageOrientation: "landscape",
    };
    //pdfmake.createPdf(docDefinition)
    var pdfDocGenerator = pdfmake.createPdf(docDefinition);
    pdfDocGenerator.open();

    //     pdfDocGenerator.getDataUrl((dataUrl) => {
    //        this.setState({
    //         urlPdf:dataUrl
    //        })

    //     // });
    //     // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    //     // pdfDocGenerator.getDataUrl((dataUrl) => {
    //     // const targetElement = document.querySelector('#iframeContainer');
    //     // const iframe = document.createElement('iframe');
    //     // iframe.src = dataUrl;
    //     // targetElement.appendChild(iframe);
    // });
  }

  render() {
    const {
      DataHistorialApi,
      DataAniosApi,
      DataMesesApi,
      urlPdf,
      Loading,
    } = this.state;
    return (
      <div>
        <li className="lii">
          <a href="#" onClick={this.ModalReportes}>
            <FaFilePdf className="text-danger" /> 1- CUADRO DE METRADOS
            EJECUTADOS (Del Ppto.Base Y Partidas adicionales) ✔
          </a>
        </li>

        <Modal
          isOpen={this.state.modal}
          fade={false}
          toggle={this.ModalReportes}
          style={{ width: "1000px", maxWidth: "9000px" }}
        >
          <ModalHeader toggle={this.ModalReportes}>
            1.- CUADRO DE METRADOS EJECUTADOS{" "}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="2">
                <fieldset>
                  <legend>Seleccione</legend>

                  <select
                    className="form-control form-control-sm"
                    onChange={(e) => this.seleccionaAnios(e)}
                  >
                    <option value="">Años</option>
                    {DataAniosApi.map((anios, iA) => (
                      <option key={iA} value={anios.anyo}>
                        {anios.anyo}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </Col>
              <Col sm="9">
                {DataMesesApi.length <= 0 ? (
                  ""
                ) : (
                  <fieldset>
                    <legend>Seleccione el Mes</legend>
                    <ButtonGroup size="sm">
                      {DataMesesApi.map((Meses, iM) => (
                        <Button
                          color="primary"
                          key={iM}
                          onClick={() =>
                            this.seleccionaMeses(
                              Meses.fecha_inicial,
                              Meses.fecha_final
                            )
                          }
                        >
                          {Meses.codigo}
                        </Button>
                      ))}
                      {/* <p>Selected: {this.state.rSelected}</p> */}
                    </ButtonGroup>
                  </fieldset>
                )}
                {/* {DataMesesApi.length = 0 ? "NO HAY NADA":""} */}
              </Col>
              {Loading ? (
                <Spinner color="primary" />
              ) : (
                <Col sm="1">
                  {DataHistorialApi.length <= 0 ? (
                    ""
                  ) : (
                    <button
                      className="btn btn-outline-success"
                      onClick={this.makePdf}
                    >
                      {" "}
                      PDF{" "}
                    </button>
                  )}
                </Col>
              )}
            </Row>
            {/* { urlPdf.length <= 0 ?<Spinner color="primary" />:
              <iframe src={this.state.urlPdf } style={{height: 'calc(100vh - 50px)'}} width="100%" ></iframe>
              } */}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_1;
