import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "axios";
import { FaFileContract, FaUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Button, Table, Tooltip } from "reactstrap";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { fechaFormatoClasico } from "../../Utils/Funciones";
import PlazosFormulario from "./PlazosFormulario";
import PlazosFormularioEdicion from "./PlazosFormularioEdicion";

import "../PlazosHistorial/Plazos.css";

export default () => {
  useEffect(() => {
    fetchPLazosPadres();
    fetchUsuarioData();
    cargarPermiso(
      "agregar_plazo,actualizar_plazo,eliminar_plazo,actualizar_archivoplazo"
    );
    return () => {};
  }, []);
  const [RefPlazosHijos, setRefPlazosHijos] = useState([]);

  function activeChildFunctions(id_padre) {
    RefPlazosHijos[id_padre].recarga();
  }
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
  const [PlazosPadres, setPlazosPadres] = useState([]);
  async function fetchPLazosPadres() {
    const res = await axios.get(`${UrlServer}/plazosPadres`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setPlazosPadres(res.data);
  }

  async function deletePlazosPadre(id) {
    if (confirm("Esta seguro que desea eliminar este estado?")) {
      const res = await axios.delete(`${UrlServer}/plazosPadresAndHijos`, {
        data: {
          id: id,
        },
      });
      alert("se elimino registro con exito");
      fetchPLazosPadres();
    }
  }

  function DescargarArchivo(data) {
    if (confirm("Desea descargar el memorandum?")) {
      const url = data;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data, "target", "_blank");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    }
  }
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const res = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setUsuarioData(res.data);
  }
  return (
    <div>
      {Permisos["agregar_plazo"] >= 1 && (
        <PlazosFormulario id_padre={null} recarga={fetchPLazosPadres} />
      )}
      <Table>
        <thead>
          <tr className="plazos-tabla">
            <th>#</th>
            <th>TIPO/ESTADO</th>
            <th>DESCRIPCIÓN</th>
            <th colSpan="3" style={{ textAlign: "center" }}>
              RESOLUCIÓN
            </th>
            <th style={{ width: "75px" }}>FECHA INICIAL</th>
            <th style={{ width: "75px" }}>FECHA FINAL</th>
            <th>DIÁS</th>
            <th>PLAZO APROBADO</th>
            <th style={{ width: "75px", textAlign: "center" }}>APROBADO EL</th>
            <th>OPCIONES</th>
          </tr>
        </thead>
        <tbody>
          {PlazosPadres.map((item, i) => [
            <tr
              key={i}
              style={{
                color: "#",
                fontWeight: "700",
                background: "#171819",
              }}
            >
              <th>{i + 1}</th>
              {/* <th scope="row">{item.id}</th> */}
              <td>{item.tipo_nombre}</td>
              <td>{item.descripcion}</td>
              <td style={{ width: "200px" }}>
                {item.documento_resolucion_estado}
              </td>
              <td>
                <TooltipUploadIcon
                  key={JSON.stringify(item)}
                  item={item}
                  DescargarArchivo={DescargarArchivo}
                  UsuarioData={UsuarioData}
                  Permisos={Permisos}
                  recargar={fetchPLazosPadres}
                />
              </td>
              <td></td>
              <td>{fechaFormatoClasico(item.fecha_inicio)}</td>
              <td>{fechaFormatoClasico(item.fecha_final)}</td>
              <td>{item.n_dias}</td>
              <td>{item.plazo_aprobado == 1 ? "Aprobado" : "Sin aprobar"}</td>
              <td>{fechaFormatoClasico(item.fecha_aprobada)}</td>
              <td style={{ display: "flex" }}>
                {Permisos["agregar_plazo"] >= 1 && (
                  <PlazosFormulario
                    id_padre={item.id}
                    recarga={activeChildFunctions}
                  />
                )}
                {Permisos["actualizar_plazo"] >= 1 && (
                  <PlazosFormularioEdicion
                    data={item}
                    recarga={fetchPLazosPadres}
                  />
                )}
                {Permisos["eliminar_plazo"] >= 1 && (
                  <Button
                    color="info"
                    outline
                    onClick={() => deletePlazosPadre(item.id)}
                  >
                    <MdDeleteForever />
                  </Button>
                )}
              </td>
            </tr>,

            <PLazosHijos
              id_padre={item.id}
              count={i + 1}
              ref={(ref) => {
                var clone = RefPlazosHijos;
                clone[item.id] = ref;
                setRefPlazosHijos(clone);
              }}
              DescargarArchivo={DescargarArchivo}
              UsuarioData={UsuarioData}
              Permisos={Permisos}
            />,
          ])}
          <tr
            style={{
              fontWeight: 700,
            }}
          >
            <td
              colSpan="8"
              style={{
                textAlign: "right",
              }}
            >
              TOTAL DIAS APROBADOS
            </td>
            <td>
              {(() => {
                return PlazosPadres.reduce((acu, item) => {
                  if (item.plazo_aprobado) {
                    return acu + item.n_dias;
                  }
                  return acu;
                }, 0);
              })()}
            </td>
            <td colSpan="3"></td>
          </tr>
          <tr
            style={{
              fontWeight: 700,
            }}
          >
            <td
              colSpan="8"
              style={{
                textAlign: "right",
              }}
            >
              TOTAL DIAS SIN APROBAR
            </td>
            <td>
              {(() => {
                return PlazosPadres.reduce((acu, item) => {
                  if (!item.plazo_aprobado) {
                    return acu + item.n_dias;
                  }
                  return acu;
                }, 0);
              })()}
            </td>
            <td colSpan="3"></td>
          </tr>
          <tr
            style={{
              fontWeight: 700,
            }}
          >
            <td
              colSpan="8"
              style={{
                textAlign: "right",
              }}
            >
              PLAZO DE EJECUCION TOTAL
            </td>
            <td>
              {(() => {
                return PlazosPadres.reduce((acu, item) => acu + item.n_dias, 0);
              })()}
            </td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
const PLazosHijos = forwardRef(
  ({ id_padre, count, DescargarArchivo, UsuarioData, Permisos }, ref) => {
    useImperativeHandle(ref, () => ({
      recarga() {
        fetchCargarPlazosHijos();
      },
    }));

    useEffect(() => {
      fetchCargarPlazosHijos();
      return () => {};
    }, []);
    const [CargarPlazosHijos, setCargarPlazosHijos] = useState([]);
    async function fetchCargarPlazosHijos() {
      const res = await axios.get(`${UrlServer}/plazosHijos`, {
        params: {
          id_ficha: sessionStorage.getItem("idobra"),
          id_padre: id_padre,
        },
      });
      setCargarPlazosHijos(res.data);
    }
    async function deletePlazosHijos(id) {
      if (confirm("Esta seguro que desea eliminar este Subestado?")) {
        const res = await axios.delete(`${UrlServer}/plazosPadresAndHijos`, {
          data: {
            id: id,
          },
        });
        alert("se elimino registro con exito");
        fetchCargarPlazosHijos();
      }
    }
    return CargarPlazosHijos.map((item, i) => (
      <tr key={i}>
        <td style={{ paddingLeft: "20px" }}>{count + "." + (i + 1)}</td>
        <td>{item.tipo_nombre}</td>
        <td>{item.descripcion}</td>
        <td>{item.documento_resolucion_estado}</td>
        <td>
          {
            <TooltipUploadIcon
              key={JSON.stringify(item)}
              item={item}
              DescargarArchivo={DescargarArchivo}
              UsuarioData={UsuarioData}
              Permisos={Permisos}
              recargar={fetchCargarPlazosHijos}
            />
          }
        </td>
        <td></td>
        <td>{fechaFormatoClasico(item.fecha_inicio)}</td>
        <td>{fechaFormatoClasico(item.fecha_final)}</td>
        <td>{item.n_dias}</td>
        <td></td>
        <td>{item.fecha_aprobada}</td>
        <td style={{ display: "flex" }}>
          {Permisos["actualizar_plazo"] >= 1 && (
            <PlazosFormularioEdicion
              data={item}
              recarga={fetchCargarPlazosHijos}
            />
          )}
          {Permisos["eliminar_plazo"] >= 1 && (
            <Button
              color="info"
              outline
              onClick={() => deletePlazosHijos(item.id)}
            >
              <MdDeleteForever />
            </Button>
          )}
        </td>
      </tr>
    ));
  }
);
function TooltipUploadIcon({ item, DescargarArchivo, Permisos, recargar }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpen2, setTooltipOpen2] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const toggle2 = () => setTooltipOpen2(!tooltipOpen2);
  //agregar archivo
  const hiddenFileInput = useRef(null);
  const [IdPlazo, setIdPlazo] = useState(0);
  async function uploadFile(id) {
    await setIdPlazo(id);
    hiddenFileInput.current.click();
  }
  async function onChangeInputFile(e) {
    if (confirm("desea subir la resolucion seleccionada?")) {
      const formData = new FormData();
      formData.append("archivo", e.target.files[0]);
      e.target.value = null;
      formData.append("codigo_obra", sessionStorage.getItem("codigoObra"));
      formData.append("id_acceso", sessionStorage.getItem("idacceso"));
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      var res = await axios.put(
        `${UrlServer}/plazos/${IdPlazo}/archivo`,
        formData,
        config
      );
      recargar();
    } else {
      e.target.value = null;
    }
  }
  return (
    <div>
      <input
        type="file"
        ref={hiddenFileInput}
        style={{
          display: "none",
        }}
        onChange={(e) => onChangeInputFile(e)}
      />
      <div style={{ textAlign: "center" }}>
        {item.archivo ? (
          <>
            <Tooltip
              placement="right"
              isOpen={tooltipOpen2}
              target="TooltipExample2"
              toggle={toggle2}
            >
              Descargar Resolución
            </Tooltip>
            <div
              className="text-primary"
              onClick={() => DescargarArchivo(`${UrlServer}${item.archivo}`)}
              style={{
                cursor: "pointer",
                width: "100%",
              }}
              id="TooltipExample2"
            >
              <FaFileContract size={20} color={"#17a2b8"} />
            </div>
            <div
              style={{
                fontWeight: "100",
                color: "white",
              }}
            >
              <div>Subido por : </div>
              <div style={{ whiteSpace: "nowrap" }}>{item.usuario_nombre}</div>
            </div>
          </>
        ) : (
          <>
            <Tooltip
              placement="right"
              isOpen={tooltipOpen}
              target="TooltipExample"
              toggle={toggle}
            >
              Adjuntar Resolución
            </Tooltip>
            <div
              onClick={() => {
                if (Permisos["actualizar_archivoplazo"]) {
                  uploadFile(item.id);
                }
              }}
              style={{
                cursor: "pointer",
                width: "100%",
              }}
              id="TooltipExample"
            >
              <FaUpload size={15} color={"#ffffff"} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
