import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Input,
  Collapse,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Col,
} from "reactstrap";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { MdComment, MdAddAPhoto } from "react-icons/md";
import LogoSigobras from "./../../../../images/logoSigobras.png";
import Comentarios from "./ComentariosObservaciones";
function HistorialObservaciones() {
  const [
    DificultadComentariosNoVistos,
    setDificultadComentariosNoVistos,
  ] = useState([]);
  const [Option, setOption] = useState();
  function setOption2(opcion) {
    fetchDificultades(opcion);
    getCantidadComentarios(opcion);
    setOption(opcion);
  }
  useEffect(() => {
    fetchUsuarioData();
  }, []);
  //usuaio data
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    await setUsuarioData(request.data);
  }
  //modal dificultades
  const [modalDificultad, setModalDificultad] = useState(false);

  const toggleDificultad = async () => {
    if (!modalDificultad) {
      setNewDificultad({
        asiento_obra: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_final: "",
        duracion: 1,
        duracion_tipo: "dias",
        fichas_id_ficha: sessionStorage.getItem("idobra"),
        tipo: Option,
        autor: sessionStorage.getItem("idacceso"),
        cargo: UsuarioData.cargo_nombre,
      });
    }
    setModalDificultad(!modalDificultad);
  };
  //modal comentarios
  const [modalComentarios, setModalComentarios] = useState(false);
  const [DificultadId, setDificultadId] = useState(false);
  const toggleComentarios = () => {
    setModalComentarios(!modalComentarios);
  };
  async function toggleComentarios2(id_dificultad) {
    setDificultadId(id_dificultad);
    setModalComentarios(!modalComentarios);
    await axios.post(`${UrlServer}/postDificultadesComentariosVistos`, {
      id_dificultad: id_dificultad,
      id_acceso: sessionStorage.getItem("idacceso"),
    });
    getCantidadComentarios(Option);
  }
  async function getCantidadComentarios(tipo) {
    //cargando la cantidad de comentarios no vistos
    var req_comentariosNoVistos = await axios.post(
      `${UrlServer}/getDificultadesComentariosNoVistosFicha`,
      {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
        tipo: tipo,
      }
    );
    setDificultadComentariosNoVistos(req_comentariosNoVistos.data);
  }

  //dificultades
  const [Dificultades, setDificultades] = useState([]);
  const [newDificultad, setNewDificultad] = useState({});
  async function fetchDificultades(tipo) {
    const request = await axios.post(`${UrlServer}/getDificultades`, {
      id_ficha: sessionStorage.getItem("idobra"),
      tipo: tipo,
    });
    setDificultades(request.data);
    return request;
  }
  function onchangeDificultades(value, name) {
    var Dataclonado = { ...newDificultad };
    Dataclonado[name] = value;
    if (
      name == "fecha_inicio" ||
      name == "fecha_final" ||
      name == "duracion" ||
      name == "duracion_tipo"
    ) {
      var dias = Dataclonado.duracion;
      if (Dataclonado.duracion_tipo == "horas") {
        dias = Dataclonado.duracion / 8;
      }
      var fecha_inicio = Dataclonado.fecha_inicio;
      fecha_inicio = fecha_inicio.split("-");
      var result = new Date(
        fecha_inicio[0],
        fecha_inicio[1] - 1,
        fecha_inicio[2]
      );
      result.setDate(result.getDate() + parseInt(dias));
      result = result.toLocaleDateString("fr-CA");
      Dataclonado.fecha_final = result;
    }
    setNewDificultad(Dataclonado);
  }

  async function saveDificultad() {
    if (confirm("Los datos ingresados se guardaran, esta seguro?")) {
      const request = await axios.post(
        `${UrlServer}/postDificultades`,
        newDificultad
      );
      alert(request.data.message);
    }
    fetchDificultades(Option);
    toggleDificultad();
  }

  return (
    <div>
      <Input
        type="select"
        onChange={(e) => setOption2(e.target.value)}
        className="w-25 form-control"
        defaultValue="SELECCIONE"
      >
        <option disabled hidden>
          SELECCIONE
        </option>
        <option>DIFICULTAD</option>
        <option>CONSULTA</option>
        <option>OBSERVACION</option>
      </Input>
      <Collapse
        isOpen={
          Option == "DIFICULTAD" ||
          Option == "CONSULTA" ||
          Option == "OBSERVACION"
            ? true
            : false
        }
      >
        {UsuarioData.cargo_nombre == "RESIDENTE" ? (
          <Button color="danger" onClick={toggleDificultad}>
            +
          </Button>
        ) : (
          ""
        )}
        <table className="table table-sm small table-hover">
          <thead>
            <tr>
              <th></th>
              {/* <th></th> */}

              <th>asiento de obra N°</th>
              {/* {Option == "DIFICULTAD" ?
                                <th>fecha</th>
                                : ""} */}
              {Option == "DIFICULTAD" ? <th>fecha</th> : ""}
              {Option == "DIFICULTAD" ? <th>dificultad</th> : ""}
              {Option == "CONSULTA" ? <th>consulta</th> : ""}
              {Option == "OBSERVACION" ? <th>observacion</th> : ""}

              {Option == "DIFICULTAD" ? <th>duracion</th> : ""}
              {Option == "DIFICULTAD" ? <th>fin</th> : ""}
            </tr>
          </thead>
          <tbody>
            {Dificultades.map((item, i) => (
              <tr key={"1." + i}>
                {/* botones */}
                {/* <td >
                                        <div className="align-center position-relative"
                                        // onClick={() => modalFoto(metrados)}
                                        >
                                            <div >
                                                <MdAddAPhoto size={15} />
                                            </div>
                                            <div style={{
                                                background: "red",
                                                borderRadius: "50%",
                                                textAlign: "center",
                                                position: "absolute",
                                                left: "9px",
                                                top: "-5px",
                                                padding: "1px 4px",
                                                zIndex: "20",
                                                fontSize: "9px",
                                                fontWeight: "bold",

                                            }}>
                                                {12}
                                            </div>
                                        </div>


                                    </td>
                                     */}
                <td>
                  <div
                    className="align-center position-relative"
                    onClick={() => toggleComentarios2(item.id)}
                  >
                    <div>
                      <MdComment size={15} />
                    </div>
                    {DificultadComentariosNoVistos[i] &&
                    DificultadComentariosNoVistos[i].mensajes ? (
                      <div
                        style={{
                          background: "red",
                          borderRadius: "50%",
                          textAlign: "center",
                          position: "absolute",
                          left: "9px",
                          top: "-5px",
                          padding: "1px 4px",
                          zIndex: "20",
                          fontSize: "9px",
                          fontWeight: "bold",
                        }}
                      >
                        {DificultadComentariosNoVistos[i].mensajes}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
                {/* asiento_obra */}
                <td>{item.asiento_obra}</td>
                {/* fecha_inicio */}
                {Option == "DIFICULTAD" ? <td>{item.fecha_inicio}</td> : ""}
                {/* fecha_registro */}
                {/* <td >
                                        {item.fecha_registro}
                                    </td> */}
                {/* descripcion */}
                <td>{item.descripcion}</td>

                {/* duracion */}

                {Option == "DIFICULTAD" ? (
                  <td>
                    {item.duracion} {item.duracion_tipo}
                  </td>
                ) : (
                  ""
                )}
                {/* fecha_final */}

                {Option == "DIFICULTAD" ? <td>{item.fecha_final}</td> : ""}
              </tr>
            ))}
          </tbody>
        </table>
      </Collapse>

      {/* MODAL FORMULARIO  */}
      <Modal isOpen={modalDificultad} toggle={toggleDificultad}>
        <ModalHeader toggle={toggleDificultad}>{Option}</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                {/* asiento_obra */}
                <Label>asiento de obra</Label>
                <DebounceInput
                  value={newDificultad.asiento_obra}
                  debounceTimeout={300}
                  onChange={(e) =>
                    onchangeDificultades(e.target.value, "asiento_obra")
                  }
                  type="number"
                  className="form-control"
                  // disabled={(UsuarioData.cargo_nombre == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                {/* fecha_inicio */}
                <Label>fecha</Label>
                <DebounceInput
                  type="date"
                  value={newDificultad.fecha_inicio}
                  debounceTimeout={300}
                  onChange={(e) =>
                    onchangeDificultades(e.target.value, "fecha_inicio")
                  }
                  className="form-control"
                  // disabled={(UsuarioData.cargo_nombre == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={12}>
              <FormGroup>
                {/* descripcion */}
                {Option == "DIFICULTAD" ? <Label>dificultad</Label> : ""}
                {Option == "CONSULTA" ? <Label>consulta</Label> : ""}
                {Option == "OBSERVACION" ? <Label>observacion</Label> : ""}

                <DebounceInput
                  value={newDificultad.descripcion}
                  debounceTimeout={300}
                  onChange={(e) =>
                    onchangeDificultades(e.target.value, "descripcion")
                  }
                  type="text"
                  className="form-control"
                  // disabled={(UsuarioData.cargo_nombre == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                />
              </FormGroup>
            </Col>
          </Row>
          {Option == "DIFICULTAD" ? (
            <Row form>
              <Col md={6}>
                <FormGroup>
                  {/* duracion */}
                  <Label>tiempo perdido</Label>
                  <DebounceInput
                    value={newDificultad.duracion}
                    debounceTimeout={300}
                    onChange={(e) =>
                      onchangeDificultades(e.target.value, "duracion")
                    }
                    type="number"
                    className="form-control"
                    // disabled={(UsuarioData.cargo_nombre == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  {/* duracion_tipo */}
                  <Label>diás/horas</Label>
                  <Input
                    type="select"
                    value={newDificultad.duracion_tipo}
                    onChange={(e) =>
                      onchangeDificultades(e.target.value, "duracion_tipo")
                    }
                    className="form-control"
                    // disabled={(UsuarioData.cargo_nombre == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                  >
                    <option disabled hidden>
                      SELECCIONE
                    </option>
                    <option>dias</option>
                    <option>horas</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => saveDificultad()}
            // disabled={item.habilitado ? false : true}
          >
            Guardar
          </Button>
          <Button color="secondary" onClick={toggleDificultad}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {/* MODAL COMENTARIOS */}
      <Modal isOpen={modalComentarios} toggle={toggleComentarios}>
        <ModalHeader>
          <div className="d-flex">
            <img
              src={LogoSigobras}
              width="30px"
              alt="logo sigobras"
              style={{
                height: "22px",
                top: "1px",
                position: "inherit",
              }}
            />
            <div
              style={{
                whiteSpace: "nowrap",
                width: "340px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginLeft: "4px",
              }}
            >
              titulo
            </div>
          </div>
        </ModalHeader>
        <Comentarios dificultades_id={DificultadId} />
      </Modal>
    </div>
  );
}

export default HistorialObservaciones;
