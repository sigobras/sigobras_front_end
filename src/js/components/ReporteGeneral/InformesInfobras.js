import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
} from "react";
import {
  FaRegTimesCircle,
  FaCheckCircle,
  FaFileAlt,
  FaPlusCircle,
  FaTrash,
} from "react-icons/fa";
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

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort, DescargarArchivo } from "../Utils/Funciones";

export default ({ data, recargar, AnyoSeleccionado }) => {
  useEffect(() => {
    cargarData();
    cargarInformesUbicaciones();
    cargarPrimerInforme();
    cargarPermiso("agregar_informe,actualizar_informe");
  }, []);
  const [Permisos, setPermisos] = useState(false);
  async function cargarPermiso(nombres_clave) {
    const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
        nombres_clave,
      },
    });
    var tempList = [];
    var tempArray = res.data;
    for (const key in tempArray) {
      tempList[key] = res.data[key];
    }
    setPermisos(tempList);
  }
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
        <tr key={i}>
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
              Permisos={Permisos}
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
            {buscarMesInData(i) ? buscarMesInData(i).abreviacion : " "}
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
  Permisos,
}) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    if (!modal) {
      if (data) {
        setInputObject({
          id: data.id,
          anyo: data.anyo,
          mes: data.mes,
          fichas_id_ficha: data.fichas_id_ficha,
          observacion: data.observacion,
          informes_ubicaciones_id: data.informes_ubicaciones_id,
          estado_presentado: data.estado_presentado,
          fecha_recepcion: data.fecha_recepcion,
          fecharegisto_infobras: data.fecharegisto_infobras,
          archivo: data.archivo,
        });
        setInputObjectModificada({
          anyo: data.anyo,
          mes: data.mes,
          fichas_id_ficha: data.fichas_id_ficha,
          informes_ubicaciones_id: data.informes_ubicaciones_id,
        });
      }
    } else {
      recargar();
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
        codigo: sessionStorage.getItem("codigoObra"),
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
      setInputObject(res.data);
    } catch (error) {
      if (error == "UBICACION_OBLIGATORIA") {
        alert("Se necesita seleccionar una ubicacion");
      } else {
        alert("Ocurrio un error");
      }
    }
  }
  return (
    <div>
      {data && data.estado_presentado ? (
        <FaCheckCircle
          color="green"
          onClick={() => {
            if (Permisos["agregar_informe"]) toggle();
          }}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FaRegTimesCircle
          color="red"
          onClick={() => {
            if (Permisos["actualizar_informe"]) toggle();
          }}
          style={{ cursor: "pointer" }}
        />
      )}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Ingreso de nuevo informe</ModalHeader>
        <form onSubmit={guardarData}>
          <ModalBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Observación General del Mes</Label>
                  <Input
                    value={InputObject.observacion}
                    name="observacion"
                    type="text"
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Ubicación</Label>
                  <Input
                    value={InputObject.informes_ubicaciones_id}
                    name="informes_ubicaciones_id"
                    type="select"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  >
                    <option value="">{"SELECCIONE"}</option>
                    {InformesUbicaciones.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.descripcion}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Fecha de recepción en Infobras</Label>
                  <Input
                    type="date"
                    onChange={handleInputChange}
                    value={InputObject.fecha_recepcion}
                    name="fecha_recepcion"
                    autoComplete="off"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Fecha de registro a Infobras</Label>
                  <Input
                    type="date"
                    onChange={handleInputChange}
                    value={InputObject.fecharegisto_infobras}
                    name="fecharegisto_infobras"
                    autoComplete="off"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Archivo</Label>
                  <Input
                    type="file"
                    onChange={handleInputChange}
                    name="archivo"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup check inline>
                  <input
                    type="checkbox"
                    className="form-control"
                    checked={InputObject.estado_presentado}
                    value={InputObject.estado_presentado}
                    name="estado_presentado"
                    onChange={handleInputChange}
                  />
                  <Label check>Registrado en Infobras</Label>
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
        {InputObject.id && (
          <ModalBody>
            <DescripcionInforme id={InputObject.id} />
          </ModalBody>
        )}
      </Modal>
    </div>
  );
}
function DescripcionInforme({ id }) {
  useEffect(() => {
    cargarDescripcion();
  }, []);
  const [Descripcion, setDescripcion] = useState([]);
  async function cargarDescripcion() {
    try {
      var res = await axios.get(
        `${UrlServer}/v1/infobras/informes/descripcion`,
        {
          params: {
            id: id,
            padres: true,
          },
        }
      );
      setDescripcion(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function agregarDescripcion() {
    try {
      var res = await axios.put(
        `${UrlServer}/v1/infobras/informes/descripcion`,
        [
          {
            id: null,
            tipo: 1,
            nombre: "",
            folios: "",
            observacion: "",
            infobras_informes_id: id,
            padre: null,
          },
        ]
      );
      cargarDescripcion();
    } catch (error) {
      console.log(error);
      alert("Ocurrio un error");
    }
  }
  function handleInputChange(event, index, item) {
    var flagClone = [...FlagCambios];
    flagClone[item.id] = true;
    setFlagCambios(flagClone);
    var clone = [...Descripcion];
    clone[index][event.target.name] = event.target.value;
    setDescripcion(clone);
  }
  const [FlagCambios, setFlagCambios] = useState([]);
  async function guardarData(item) {
    try {
      var res = await axios.put(
        `${UrlServer}/v1/infobras/informes/descripcion`,
        [item]
      );
      var flagClone = [...FlagCambios];
      flagClone[item.id] = false;
      setFlagCambios(flagClone);
    } catch (error) {
      console.log(error);
      alert("Ocurrio un error");
    }
  }
  async function eliminarDetalle(id) {
    try {
      if (confirm("Esta seguro de eliminar este dato?")) {
        var res = await axios.delete(
          `${UrlServer}/v1/infobras/informes/${id}/descripcion`
        );
      }
    } catch (error) {
      console.log(error);
      alert("Ocurrio un error");
    }
    cargarDescripcion();
  }
  const [RefDescripcionInforme, setRefDescripcionInforme] = useState([]);
  return (
    <div>
      <table
        style={{ width: "100%" }}
        className="reporteGeneral-table reporteGeneral-titulos"
      >
        <thead>
          <tr>
            <td
              colSpan="5"
              style={{
                background: "#636465",
                color: "white",
              }}
            >
              DESCRIPCIÓN DEL CONTENIDO
            </td>
          </tr>
          <tr
            style={{
              background: "#636465",
              color: "white",
            }}
          >
            <td>N°</td>
            <td>Archivadores y/o folders</td>
            <td>N° Folios</td>
            <td>Observación</td>
            <td>
              <FaPlusCircle
                onClick={() => agregarDescripcion()}
                style={{ cursor: "pointer" }}
                color="#ffd400"
                size="20"
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {Descripcion.map((item, i) => [
            <tr key={i} style={{ background: "#bbdcb0cc" }}>
              <th
                style={{
                  background: "#636465",
                  color: "white",
                }}
              >
                {i + 1}
              </th>
              <td>
                <Input
                  value={item.nombre || ""}
                  onChange={(e) => handleInputChange(e, i, item)}
                  name="nombre"
                  onBlur={() => guardarData(item)}
                  style={{
                    background: FlagCambios[item.id]
                      ? "#17a2b840"
                      : "#42ff0038",
                  }}
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  value={item.folios || ""}
                  onChange={(e) => handleInputChange(e, i, item)}
                  name="folios"
                  onBlur={() => guardarData(item)}
                  style={{
                    background: FlagCambios[item.id]
                      ? "#17a2b840"
                      : "#42ff0038",
                  }}
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  value={item.observacion || ""}
                  onChange={(e) => handleInputChange(e, i, item)}
                  name="observacion"
                  onBlur={() => guardarData(item)}
                  style={{
                    background: FlagCambios[item.id]
                      ? "#17a2b840"
                      : "#42ff0038",
                  }}
                  autoComplete="off"
                />
              </td>
              <td>
                <FaPlusCircle
                  onClick={() => {
                    console.log(RefDescripcionInforme);
                    RefDescripcionInforme[item.id].agregar();
                  }}
                  color="#595a5a"
                  style={{ cursor: "pointer" }}
                />
                <FaTrash
                  onClick={() => eliminarDetalle(item.id)}
                  color="#595a5a"
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>,
            <DescripcionDetalles
              id={item.id}
              id_informe={id}
              index={i + 1}
              ref={(ref) => {
                var clone = RefDescripcionInforme;
                clone[item.id] = ref;
                // clone[1] = ref;
                setRefDescripcionInforme(clone);
              }}
              guardarData={guardarData}
              FlagCambios={FlagCambios}
              setFlagCambios={setFlagCambios}
            />,
          ])}
        </tbody>
      </table>
    </div>
  );
}
const DescripcionDetalles = forwardRef(
  (
    { id_informe, id, index, guardarData, FlagCambios, setFlagCambios },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      agregar() {
        agregarDetalles();
      },
    }));
    useEffect(() => {
      cargarDetalles();
    }, []);
    const [Detalles, setDetalles] = useState([]);
    async function cargarDetalles() {
      try {
        var res = await axios.get(
          `${UrlServer}/v1/infobras/informes/descripcion`,
          {
            params: {
              padre: id,
            },
          }
        );
        console.log("data", id, res.data);
        setDetalles(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    async function agregarDetalles() {
      try {
        var res = await axios.put(
          `${UrlServer}/v1/infobras/informes/descripcion`,
          [
            {
              id: null,
              tipo: 2,
              nombre: "",
              folios: "",
              observacion: "",
              infobras_informes_id: id_informe,
              padre: id,
            },
          ]
        );
      } catch (error) {
        console.log(error);
        alert("Ocurrio un error");
      }
      cargarDetalles();
    }
    function handleInputChange(event, index, item) {
      var flagClone = [...FlagCambios];
      flagClone[item.id] = true;
      setFlagCambios(flagClone);

      var clone = [...Detalles];
      clone[index][event.target.name] = event.target.value;
      setDetalles(clone);
    }

    async function eliminarDetalle(id) {
      try {
        if (confirm("Esta seguro de eliminar este dato?")) {
          var res = await axios.delete(
            `${UrlServer}/v1/infobras/informes/${id}/descripcion`
          );
        }
      } catch (error) {
        console.log(error);
        alert("Ocurrio un error");
      }
      cargarDetalles();
    }
    return Detalles.map((item, i) => (
      <tr key={i}>
        <td
          style={{
            background: "#636465",
            color: "white",
          }}
        >
          {index + "." + (i + 1)}
        </td>
        <td>
          <Input
            value={item.nombre || ""}
            onChange={(e) => handleInputChange(e, i, item)}
            name="nombre"
            onBlur={() => guardarData(item)}
            style={{
              background: FlagCambios[item.id] ? "#17a2b840" : "#42ff0038",
            }}
            autoComplete="off"
          />
        </td>
        <td>
          <Input
            value={item.folios || ""}
            onChange={(e) => handleInputChange(e, i, item)}
            name="folios"
            onBlur={() => guardarData(item)}
            style={{
              background: FlagCambios[item.id] ? "#17a2b840" : "#42ff0038",
            }}
            autoComplete="off"
          />
        </td>
        <td>
          <Input
            value={item.observacion || ""}
            onChange={(e) => handleInputChange(e, i, item)}
            name="observacion"
            onBlur={() => guardarData(item)}
            style={{
              background: FlagCambios[item.id] ? "#17a2b840" : "#42ff0038",
            }}
            autoComplete="off"
          />
        </td>
        <td>
          <FaTrash
            onClick={() => eliminarDetalle(item.id)}
            color="#595a5a"
            style={{ cursor: "pointer" }}
          />
        </td>
      </tr>
    ));
  }
);
