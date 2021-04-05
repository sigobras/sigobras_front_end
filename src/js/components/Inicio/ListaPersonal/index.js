import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Input,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import { FaUserFriends, FaMediumM, FaUpload, FaSave } from "react-icons/fa";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { DescargarArchivo } from "../../Utils/Funciones";
import FormularioPersonal from "./FormularioPersonal";
import UsuarioDetalles from "./UsuarioDetalles";
import ListaPersonal from "./ListaPersonal";

export default ({ id_ficha, codigo_obra }) => {
  const [Permisos, setPermisos] = useState([]);
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
  const hiddenFileInput = useRef(null);
  //modal personal
  const [ModalPersonal, setModalPersonal] = useState(false);
  function toggleModalPersonal() {
    setModalPersonal(!ModalPersonal);
    if (!ModalPersonal) {
      fetchCargosPersonal();
      fetchUsuarioData();
      setIdCargoSeleccionado(0);
      cargarPermiso(
        "actualizar_habilitarpersonal,actualizar_datospersonal,agregar_personal,actualizar_fechapersonal,actualizar_memorandumpersonal"
      );
    }
  }
  //getcargos
  const [CargosPersonal, setCargosPersonal] = useState([]);
  async function fetchCargosPersonal() {
    var res = await axios.get(`${UrlServer}/v1/cargos/obra`, {
      params: {
        id_ficha: id_ficha,
        cargos_tipo_id: 3,
      },
    });
    setCargosPersonal(res.data);
  }
  //get usuarios
  const [IdCargoSeleccionado, setIdCargoSeleccionado] = useState(-1);
  //input file
  const [idDesignacion, setidDesignacion] = useState(0);
  async function uploadFile(id) {
    await setidDesignacion(id);
    hiddenFileInput.current.click();
  }
  async function onChangeInputFile(e) {
    if (confirm("desea subir el memorandum seleccionado?")) {
      const formData = new FormData();
      formData.append("memorandum", e.target.files[0]);
      e.target.value = null;
      formData.append("obra_codigo", codigo_obra);
      formData.append("id", idDesignacion);
      formData.append("id_ficha", id_ficha);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const res = await axios.put(
        `${UrlServer}/v1/designaciones/${idDesignacion}/memorandum`,
        formData,
        config
      );
      console.log(res.data);
      cargarHistorialPersonal();
    } else {
      e.target.value = null;
    }
  }
  //UsuarioData
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.get(
      `${UrlServer}/v1/usuarios/obra/${id_ficha}/acceso/${sessionStorage.getItem(
        "idacceso"
      )}`
    );
    setUsuarioData(request.data);
  }

  //nueva interfaz
  const [HistorialPersonal, setHistorialPersonal] = useState([]);
  async function cargarHistorialPersonal() {
    const res = await axios.get(`${UrlServer}/v1/designaciones`, {
      params: {
        id_ficha,
        id_cargo: IdCargoSeleccionado,
      },
    });
    setHistorialPersonal(res.data);
  }
  const handleInputChange = (index, name, value) => {
    var clone = [...HistorialPersonal];
    clone[index][name] = value;
    setHistorialPersonal(clone);
  };
  async function guardarDesignaciones(index) {
    var clone = [...HistorialPersonal];
    console.log(clone, index);
    await axios.put(`${UrlServer}/v1/designaciones/${clone[index].id}`, {
      fecha_inicio: clone[index].fecha_inicio,
      fecha_final: clone[index].fecha_final,
    });
    alert("Registro exitoso");
    cargarHistorialPersonal();
  }
  async function guardarDesignacionesNull(index, name) {
    try {
      var clone = [...HistorialPersonal];
      clone[index][name] = null;
      await axios.put(`${UrlServer}/v1/designaciones/${clone[index].id}`, {
        fecha_inicio: clone[index].fecha_inicio,
        fecha_final: clone[index].fecha_final,
        tipoUndefined: true,
      });
      cargarHistorialPersonal();
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  useEffect(() => {
    if (IdCargoSeleccionado != -1) {
      cargarHistorialPersonal();
    }
  }, [IdCargoSeleccionado]);
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="Personal"
        onClick={() => toggleModalPersonal()}
      >
        <FaUserFriends />
      </button>
      <Modal isOpen={ModalPersonal} toggle={toggleModalPersonal} size="lg">
        <ModalHeader>{codigo_obra} - PERSONAL TECNICO DE OBRA</ModalHeader>
        <ModalBody>
          <div className="card">
            <Nav tabs>
              {UsuarioData.cargos_tipo_id <= 2 && (
                <NavLink
                  onClick={() => setIdCargoSeleccionado(-2)}
                  active={IdCargoSeleccionado == -2}
                >
                  Personal Planta
                </NavLink>
              )}

              {CargosPersonal.map((item, i) => (
                <NavLink
                  key={i}
                  active={IdCargoSeleccionado === item.id_cargo}
                  onClick={() => {
                    setIdCargoSeleccionado(item.id_cargo);
                  }}
                >
                  {item.cargo_nombre.toUpperCase()}
                </NavLink>
              ))}
              <NavLink
                active={IdCargoSeleccionado == 0}
                onClick={() => {
                  setIdCargoSeleccionado(0);
                }}
                style={{
                  background: "orange",
                }}
              >
                LISTA PERSONAL
              </NavLink>
              <NavLink>
                {Permisos["agregar_personal"] == 1 && (
                  <FormularioPersonal
                    id_ficha={id_ficha}
                    recargar={() => {
                      fetchCargosPersonal();
                      cargarHistorialPersonal();
                    }}
                    id_cargo={IdCargoSeleccionado}
                  />
                )}
              </NavLink>
            </Nav>

            {IdCargoSeleccionado == 0 || IdCargoSeleccionado == -2 ? (
              <ListaPersonal
                key={IdCargoSeleccionado}
                id_ficha={id_ficha}
                UsuarioData={UsuarioData}
                cargos_tipo_id={IdCargoSeleccionado == 0 ? 3 : 2}
                Permisos={Permisos}
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan="3">nombre</th>
                    <th>fecha de ingreso</th>
                    <th>fecha de salida</th>
                    <th>estado</th>
                    <th>opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {HistorialPersonal.map((item, i) => (
                    <tr key={item.id}>
                      <td>
                        <UsuarioDetalles data={item} />
                      </td>
                      <td>
                        {Permisos["actualizar_memorandumpersonal"] == 1 && (
                          <div
                            onClick={() => uploadFile(item.id)}
                            style={{
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            <FaUpload size={10} color={"#ffffff"} />
                          </div>
                        )}
                      </td>
                      <td>
                        {item.memorandum !== null && (
                          <div
                            className="text-primary"
                            title="descargar memorandum"
                            onClick={() =>
                              DescargarArchivo(`${UrlServer}${item.memorandum}`)
                            }
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <FaMediumM size={15} color={"#2676bb"} />
                          </div>
                        )}
                      </td>
                      <td>
                        <Input
                          type="date"
                          value={item.fecha_inicio}
                          onChange={(e) =>
                            handleInputChange(i, "fecha_inicio", e.target.value)
                          }
                          disabled={!Permisos["actualizar_fechapersonal"]}
                        />
                      </td>
                      <td style={{ display: "flex" }}>
                        <Input
                          type="date"
                          value={
                            item.fecha_final == null ? "" : item.fecha_final
                          }
                          onChange={(e) =>
                            handleInputChange(i, "fecha_final", e.target.value)
                          }
                          disabled={!Permisos["actualizar_fechapersonal"]}
                        />
                        {Permisos["actualizar_fechapersonal"] == 1 && (
                          <Button
                            outline
                            color="danger"
                            onClick={() => {
                              guardarDesignacionesNull(i, "fecha_final");
                            }}
                          >
                            X
                          </Button>
                        )}
                      </td>

                      <td>
                        {item.habilitado ? (
                          <div
                            style={{
                              fontWeight: "700",
                              color: "green",
                            }}
                          >
                            Habilitado
                          </div>
                        ) : (
                          <div
                            style={{
                              fontWeight: "700",
                              color: "red",
                            }}
                          >
                            Deshabilitado
                          </div>
                        )}
                      </td>
                      <td>
                        {Permisos["actualizar_fechapersonal"] && (
                          <Button
                            outline
                            color="primary"
                            onClick={() => guardarDesignaciones(i)}
                          >
                            <FaSave />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ModalBody>
      </Modal>
      <input
        type="file"
        ref={hiddenFileInput}
        style={{
          display: "none",
        }}
        onChange={(e) => onChangeInputFile(e)}
      />
    </div>
  );
};
