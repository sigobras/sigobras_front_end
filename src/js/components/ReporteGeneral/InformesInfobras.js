import React, { useState, useEffect } from "react";
import { FaRegTimesCircle, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import {
  Button,
  Input,
  ModalHeader,
  ModalBody,
  Modal,
  ModalFooter,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";
import BotonNuevo from "../../libs/BotonNuevo";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, recargar, AnyoSeleccionado }) => {
  useEffect(() => {
    cargarData();
    cargarInformesUbicaciones();
    cargarPrimerInforme();
  }, []);
  const [Informes, setInformes] = useState([]);
  async function cargarData() {
    try {
      var res = await axios.get(`${UrlServer}/v1/infobras/informes`, {
        params: {
          id_ficha: data.id_ficha,
          anyo: AnyoSeleccionado,
        },
      });
      setInformes(res.data);
    } catch (error) {}
  }
  const [PrimerInforme, setPrimerInforme] = useState({ anyo: "", mes: "" });
  async function cargarPrimerInforme() {
    try {
      var res = await axios.get(`${UrlServer}/v1/infobras/informes`, {
        params: {
          id_ficha: data.id_ficha,
          limit: 1,
        },
      });
      if (res && res.data && res.data.length > 0) {
        setPrimerInforme(res.data[0]);
      }
    } catch (error) {}
  }
  function buscarMesInData(mes) {
    var tempItem = Informes.find((item, i) => item.mes == mes);
    return tempItem;
  }
  //render
  function renderMeses() {
    var tempRender = [];
    for (let i = 1; i <= 12; i++) {
      tempRender.push(
        <tr>
          <th>{mesesShort[i - 1] + "-" + AnyoSeleccionado}</th>
          <td>
            <NuevoInforme
              key={buscarMesInData(i)}
              anyo={AnyoSeleccionado}
              mes={i}
              fichas_id_ficha={data.id_ficha}
              recargar={cargarData}
              data={buscarMesInData(i)}
              InformesUbicaciones={InformesUbicaciones}
            />
          </td>
          <td>
            {buscarMesInData(i) && buscarMesInData(i).archivo && (
              <FaFileAlt
                onClick={() =>
                  DescargarArchivo(`${UrlServer}${buscarMesInData(i).archivo}`)
                }
                style={{ cursor: "pointer" }}
              />
            )}
          </td>
          <td style={{ width: "62px" }}>
            {buscarMesInData(i) ? buscarMesInData(i).abreviacion : ""}
          </td>
        </tr>
      );
    }
    return tempRender;
  }
  //cargar ubicaciones de informes
  const [InformesUbicaciones, setInformesUbicaciones] = useState([]);
  async function cargarInformesUbicaciones() {
    try {
      var res = await axios.get(`${UrlServer}/v1/informesUbicaciones`);
      setInformesUbicaciones(res.data);
    } catch (error) {}
  }
  return (
    <div style={{ width: "150px" }}>
      <table style={{ width: "100%" }}>
        <tbody className="reporteGeneral-titulos">
          {renderMeses()}
          {PrimerInforme.mes && (
            <tr>
              <td colSpan="4">
                El primer informe emitido fue en:{" "}
                {mesesShort[PrimerInforme.mes - 1] + " " + PrimerInforme.anyo}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
function NuevoInforme({
  data,
  anyo,
  mes,
  fichas_id_ficha,
  recargar,
  InformesUbicaciones,
}) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    if (!modal) {
      if (data) {
        setInputObject({
          anyo: data.anyo,
          mes: data.mes,
          fichas_id_ficha: data.fichas_id_ficha,
          observacion: data.observacion,
          informes_ubicaciones_id: data.informes_ubicaciones_id,
          codigo: sessionStorage.getItem("codigoObra"),
          estado_presentado: data.estado_presentado,
          archivo: data.archivo,
        });
        setInputObjectModificada({
          anyo: data.anyo,
          mes: data.mes,
          fichas_id_ficha: data.fichas_id_ficha,
          informes_ubicaciones_id: data.informes_ubicaciones_id,
        });
      }
    }
    setModal(!modal);
  };
  const [InputObject, setInputObject] = useState({
    anyo,
    mes,
    fichas_id_ficha,
    observacion: "",
    informes_ubicaciones_id: "",
    codigo: sessionStorage.getItem("codigoObra"),
    estado_presentado: false,
  });
  const [InputObjectModificada, setInputObjectModificada] = useState({
    anyo,
    mes,
    fichas_id_ficha,
    informes_ubicaciones_id: "",
  });
  const [FlagModificacionArchivo, setFlagModificacionArchivo] = useState(false);
  function handleInputChange(e) {
    console.log("InputObjectModificada", InputObjectModificada);
    if (e.target.name == "archivo") {
      setFlagModificacionArchivo(true);
      setInputObject({
        ...InputObject,
        [e.target.name]: e.target.files[0],
      });
      setInputObjectModificada({
        ...InputObjectModificada,
        codigo: sessionStorage.getItem("codigoObra"),
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name == "estado_presentado") {
      setInputObject({
        ...InputObject,
        [e.target.name]: e.target.value == "false" ? true : false,
      });
      setInputObjectModificada({
        ...InputObjectModificada,
        [e.target.name]: e.target.value == "false" ? true : false,
      });
    } else {
      setInputObject({
        ...InputObject,
        [e.target.name]: e.target.value,
      });
      setInputObjectModificada({
        ...InputObjectModificada,
        [e.target.name]: e.target.value,
      });
    }
    console.log("InputObjectModificada", InputObjectModificada);
  }
  async function guardarData(e) {
    e.preventDefault();
    try {
      if (InputObjectModificada.informes_ubicaciones_id == "") {
        throw "UBICACION_OBLIGATORIA";
      }
      if (
        data &&
        FlagModificacionArchivo &&
        !confirm("Se modificar el archivo ya registradom desea proceder?")
      ) {
        return;
      }
      console.log("InputObjectModificada", InputObjectModificada);
      const form_data = new FormData();
      for (var key in InputObjectModificada) {
        form_data.append(key, InputObjectModificada[key]);
      }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      var res = await axios.put(
        `${UrlServer}/v1/infobras/informes`,
        form_data,
        config
      );
      alert("Registro exitoso");

      recargar();
    } catch (error) {
      if (error == "UBICACION_OBLIGATORIA") {
        alert("Se necesita seleccionar una ubicacion");
      } else {
        alert("Ocurrio un error");
      }
    }
    toggle();
  }
  function DescargarArchivo(data) {
    if (confirm("Desea descargar el archivo?")) {
      const url = data;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data, "target", "_blank");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    }
  }

  return (
    <div>
      {data && data.estado_presentado ? (
        <FaCheckCircle
          color="green"
          onClick={toggle}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FaRegTimesCircle
          color="red"
          onClick={toggle}
          style={{ cursor: "pointer" }}
        />
      )}
      {/* {data && data.archivo && (
        <FaFileAlt
          onClick={() => DescargarArchivo(`${UrlServer}${data.archivo}`)}
          style={{ cursor: "pointer" }}
        />
      )} */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Ingreso de nuevo informe</ModalHeader>
        <form onSubmit={guardarData}>
          <ModalBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Observacion</Label>
                  <Input
                    value={InputObject.observacion}
                    name="observacion"
                    type="text"
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Ubicacion</Label>
                  <Input
                    value={InputObject.informes_ubicaciones_id}
                    name="informes_ubicaciones_id"
                    type="select"
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{"SELECCIONE"}</option>
                    {InformesUbicaciones.map((item, i) => (
                      <option value={item.id}>{item.descripcion}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>
                    archivo
                    {data && data.archivo && (
                      <FaFileAlt
                        onClick={() =>
                          DescargarArchivo(`${UrlServer}${InputObject.archivo}`)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </Label>
                  <Input
                    // value={FormularioData.nombre}
                    type="file"
                    onChange={handleInputChange}
                    name="archivo"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup check>
                  <Label check>
                    <input
                      type="checkbox"
                      className="form-control"
                      checked={InputObject.estado_presentado}
                      value={InputObject.estado_presentado}
                      name="estado_presentado"
                      onChange={handleInputChange}
                    />
                    Registrado en Infobras
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {data ? "Actualizar" : "Guardar"}
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
