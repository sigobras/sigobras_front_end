import React, { Component } from "react";
import {
  Card,
  Modal,
  CardHeader,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  InputGroup,
  InputGroupText,
  Input,
  Row,
  Col,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import { MdImage, MdBrokenImage, MdSearch } from "react-icons/md";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import Gallery from "react-grid-gallery";

class HistorialImagenesObra extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DataComponentesApi: [],
      DataPartidasApi: [],
      DataImagenesApi: [],
      activeTab: "0",
      // capturamos el nombre del componete
      nombreComponente: "",
      collapse: -1,
      SMSHistImgApi: false,
      // busqueda input
      searchString: "",
      // TABS IMAGENES
      activeTabImagen: "getImagenesHistorialPartidas",
      // modal para mostrar primer y ultimo imagen
      modal: false,
      // estado para guardar primer y ultimo imagen
      PriUlImg: "",
    };
    this.TabsComponentes = this.TabsComponentes.bind(this);
    this.CollapseItem = this.CollapseItem.bind(this);
    this.ChangeInputFilter = this.ChangeInputFilter.bind(this);
    this.primeraImagen = this.primeraImagen.bind(this);
    this.TabImg = this.TabImg.bind(this);
    this.getImgSize = this.getImgSize.bind(this);
    this.SeteaStateResponse = this.SeteaStateResponse.bind(this);
  }

  componentDidMount() {
    axios
      .post(`${UrlServer}/getImagenesComponentes`, {
        id_ficha: sessionStorage.getItem("idobra"),
      })
      .then((res) => {
        // console.log("res componentes imagenes", res.data[0].partidas)
        if (res.data !== "vacio") {
          this.setState({
            DataComponentesApi: res.data,
            DataPartidasApi: res.data[0].partidas,

            nombreComponente: res.data[0].nombre,
          });
          return;
        }

        this.setState({
          SMSHistImgApi: true,
        });
      })
      .catch((err) => {
        console.error("error al tratar de llamar al api", err);
      });
  }

  SeteaStateResponse(DataQueLLega) {
    var dataAgrupar = [];

    DataQueLLega.forEach((img) => {
      dataAgrupar.push({
        src: `${UrlServer}${img.imagen}`,
        thumbnail: `${UrlServer}${img.imagen}`,
        thumbnailWidth: "10%",
        thumbnailHeight: "5%",
        // tags: [{ value: "Ocean", title: "Ocean" }, { value: "People", title: "People" }],
        caption: `DESCRIPCIÓN DE LA FOTOGRAFÍA : ${img.descripcion} / fecha: ${img.fecha}`,
      });
    });

    // console.log("dataAgrupar", dataAgrupar)

    this.setState({
      DataImagenesApi: dataAgrupar,
    });
  }

  TabsComponentes(tab, idComponente, nombreComponente) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        nombreComponente,
        DataPartidasApi: [],
        collapse: -1,
      });
      // console.log("dataAgrupar", DataPartidasApi)

      // llamamos al api de partidas getImagenesPartidas
      axios
        .post(`${UrlServer}/getImagenesPartidas`, {
          id_componente: idComponente,
        })
        .then((res) => {
          // console.log("res actividades imagenes", res.data)
          var DataQueLLega = res.data;
          if (DataQueLLega !== "vacio") {
            this.setState({
              DataPartidasApi: DataQueLLega,
            });
          }
        })
        .catch((err) => {
          console.error("error al tratar de llamar al api", err);
        });
    }
  }

  CollapseItem(valor, idPartidad) {
    let event = valor;
    this.setState({
      collapse: this.state.collapse === Number(event) ? -1 : Number(event),
      DataImagenesApi: [],
      // setea al componente partidas imagen al  hcer  onClick en otra partida
      activeTabImagen: "getImagenesHistorialPartidas",
    });

    // consumir el api de immagenes historial de imagenes
    if (this.state.collapse !== event) {
      axios
        .post(`${UrlServer}/getImagenesHistorialPartidas`, {
          id_partida: idPartidad,
        })
        .then((res) => {
          console.log("res actividades imagenes", res.data);
          var DataQueLLega = res.data;

          if (DataQueLLega !== "vacio") {
            this.SeteaStateResponse(DataQueLLega);
          }
        })
        .catch((err) => {
          console.error("error al tratar de llamar al api", err);
        });
    }
  }

  ChangeInputFilter(e) {
    this.setState({
      searchString: e.target.value,
      DataImagenesApi: [],
    });
  }
  // funcion mostrar primer y ultimo imagen
  primeraImagen(id_partida, ruta) {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));

    if (id_partida !== "") {
      console.log(id_partida, "id_partida");
      axios
        .post(`${UrlServer}${ruta}`, {
          id_partida: id_partida,
        })

        .then((res) => {
          // console.log("res actividades imagenes", res.data)
          this.setState({
            PriUlImg: res.data.imagen,
          });
        })
        .catch((err) => {
          console.error("error al tratar de llamar al api", err);
        });
    }
  }

  TabImg(tab, idPartida) {
    if (this.state.activeTabImagen !== tab) {
      this.setState({
        activeTabImagen: tab,
        DataImagenesApi: [],
      });

      // llama al api de imagenes actividades

      axios
        .post(`${UrlServer}/${tab}`, {
          id_partida: idPartida,
        })
        .then((res) => {
          console.log("res actividades imagenes", res.data);
          var DataQueLLega = res.data;

          if (DataQueLLega !== "vacio") {
            this.SeteaStateResponse(DataQueLLega);
            return;
          }
          // this.setState({
          //   activeTabImagen:"getImagenesHistorialPartidas"

          // })
        })
        .catch((err) => {
          console.error("error al tratar de llamar al api", err);
        });
    }
  }

  getImgSize(imgSrc) {
    // console.log("ejecutanado", imgSrc)
    var newImg = new Image();

    newImg.onload = function () {
      var height = newImg.height;
      var width = newImg.width;

      console.log("tamaños de la imagen " + width + "*" + height);
      return;
    };

    newImg.src = imgSrc; //this must be done AFTER setting onload
    // console.log(newImg.src)
  }

  render() {
    const {
      DataComponentesApi,
      nombreComponente,
      DataPartidasApi,
      DataImagenesApi,
      collapse,
      SMSHistImgApi,
      modal,
      PriUlImg,
    } = this.state;

    var DatosPartidasFiltrado = DataPartidasApi;
    var searchString = this.state.searchString.trim().toLowerCase();

    if (searchString.length > 0) {
      DatosPartidasFiltrado = DatosPartidasFiltrado.filter((i) => {
        return i.descripcion.toLowerCase().match(searchString);
      });
    }

    // boton cerrar modal

    const externalCloseBtn = (
      <button
        className="close"
        style={{
          position: "absolute",
          top: "3px",
          right: "30%",
          color: "#ffffff",
        }}
        onClick={() => this.primeraImagen("", "")}
      >
        &times;
      </button>
    );

    return (
      <div>
        {SMSHistImgApi === true ? (
          <div className="text-center text-danger">
            {" "}
            No hay datos que mostar{" "}
          </div>
        ) : (
          <Card>
            <Nav tabs>
              {DataComponentesApi.map((Comp, IC) => (
                <NavItem key={IC}>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === IC.toString(),
                    })}
                    onClick={() => {
                      this.TabsComponentes(
                        IC.toString(),
                        Comp.id_componente,
                        Comp.nombre
                      );
                    }}
                  >
                    C- {Comp.numero}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>

            <Card className="m-1">
              <CardHeader>{nombreComponente}</CardHeader>
              <CardBody>
                <div className="clearfix">
                  <div className="float-left">
                    <InputGroup size="sm">
                      <InputGroup>CANT. DE PARTIDAS </InputGroup>
                      <label className="form-control form-control-sm">
                        {DataPartidasApi.length}
                      </label>
                    </InputGroup>
                  </div>
                  <div className="float-right">
                    z``
                    <InputGroup size="sm">
                      {/* < InputGroup  >ss <MdSearch size={20}/> </ InputGroup> */}
                      <InputGroup>
                        <InputGroupText>
                          <MdSearch size={20} />{" "}
                        </InputGroupText>{" "}
                      </InputGroup>

                      <Input
                        value={this.state.searchString}
                        onChange={this.ChangeInputFilter}
                        placeholder="Buscar Partida "
                      />
                    </InputGroup>
                  </div>
                </div>

                <table className="table table-sm ">
                  <thead>
                    <tr>
                      <th>ITEM</th>
                      <th>DESCRICION</th>
                      <th>CANT IMG</th>
                      <th>AVANCE</th>
                    </tr>
                  </thead>
                  {DatosPartidasFiltrado.map((partida, IP) => (
                    <tbody key={IP}>
                      <tr
                        className={
                          partida.tipo === "titulo"
                            ? "font-weight-bold"
                            : collapse === IP
                            ? "font-weight-light resplandPartida icoVer"
                            : "font-weight-light icoVer"
                        }
                      >
                        <td
                          className={
                            partida.tipo === "titulo"
                              ? ""
                              : collapse === IP
                              ? "tdData1"
                              : "tdData"
                          }
                          onClick={() =>
                            partida.tipo === "titulo"
                              ? this.CollapseItem(-1, -1)
                              : this.CollapseItem(IP, partida.id_partida)
                          }
                          data-event={IP}
                        >
                          {partida.item}
                        </td>
                        <td>{partida.descripcion}</td>
                        <td>{partida.numero_imagenes}</td>
                        <td>
                          {partida.porcentaje_avance}

                          {/* iconos mostrar primer y ultima  imagen */}
                          <div className="aprecerIcon">
                            <div
                              className="iconoTr"
                              onClick={() =>
                                this.primeraImagen(
                                  partida.id_partida,
                                  "/getImagenesPrimeraImagenPartida"
                                )
                              }
                            >
                              <MdImage size={20} />
                            </div>

                            <div
                              className="iconoTr"
                              onClick={() =>
                                this.primeraImagen(
                                  partida.id_partida,
                                  "/getImagenesUltimaImagenPartida"
                                )
                              }
                            >
                              <MdBrokenImage size={20} />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className={
                          collapse === IP ? "resplandPartidabottom" : "d-none"
                        }
                      >
                        <td colSpan="5">
                          <Collapse isOpen={collapse === IP}>
                            <Nav tabs>
                              <NavItem>
                                <NavLink
                                  className={classnames({
                                    active:
                                      this.state.activeTabImagen ===
                                      "getImagenesHistorialPartidas",
                                  })}
                                  onClick={() =>
                                    this.TabImg(
                                      "getImagenesHistorialPartidas",
                                      partida.id_partida
                                    )
                                  }
                                >
                                  PARTIDAS
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  className={classnames({
                                    active:
                                      this.state.activeTabImagen ===
                                      "getImagenesHistorialActividades",
                                  })}
                                  onClick={() =>
                                    this.TabImg(
                                      "getImagenesHistorialActividades",
                                      partida.id_partida
                                    )
                                  }
                                >
                                  ACTIVIDADES
                                </NavLink>
                              </NavItem>
                            </Nav>
                            {DataImagenesApi.length !== 0 ? (
                              <Gallery images={DataImagenesApi} />
                            ) : (
                              "No hay imagenes que mostrar"
                            )}
                          </Collapse>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </CardBody>
            </Card>
          </Card>
        )}
        {/* modal mostrar primer  y ultima  imagen */}
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.primeraImagen("", "")}
          external={externalCloseBtn}
        >
          <ModalBody className="p-0 m-0">
            {this.state.PriUlImg === "" ? (
              ""
            ) : (
              <img
                src={`${UrlServer}${this.state.PriUlImg}`}
                alt="imagende  prueva"
                className="img-fluid"
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <br />
            <b>descripcion</b>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default HistorialImagenesObra;
