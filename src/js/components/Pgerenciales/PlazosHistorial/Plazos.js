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
import { Button, Table } from "reactstrap";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { fechaFormatoClasico } from "../../Utils/Funciones";
import PlazosFormulario from "./PlazosFormulario";
import PlazosFormularioEdicion from "./PlazosFormularioEdicion";

import "../PlazosHistorial/Plazos.css";

export default () => {
  const [RefPlazosHijos, setRefPlazosHijos] = useState([]);

  function activeChildFunctions(id_padre) {
    RefPlazosHijos[id_padre].recarga();
  }

  useEffect(() => {
    fetchPLazosPadres();
    return () => {};
  }, []);

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
      formData.append("codigo_obra", sessionStorage.getItem("idobra"));
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
      console.log(res);
      fetchPLazosPadres();
    } else {
      e.target.value = null;
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
  return (
    <div>
      <PlazosFormulario id_padre={null} recarga={fetchPLazosPadres} />

      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>TIPO/ESTADO</th>
            <th>DESCRIPCIÓN</th>
            <th colSpan="3" style={{ textAlign: "center" }}>
              RESOLUCIÓN
            </th>
            <th>FECHA INICIAL</th>
            <th>FECHA FINAL</th>
            <th>DIÁS</th>
            <th>PLAZO APROBADO</th>
            <th>APROBADO EL</th>
            <th>OPCIONES</th>
          </tr>
        </thead>
        <tbody>
          <input
            type="file"
            ref={hiddenFileInput}
            style={{
              display: "none",
            }}
            onChange={(e) => onChangeInputFile(e)}
          />
          {PlazosPadres.map((item, i) => [
            <tr
              key={i}
              style={{
                color: "#17a2b8",
                fontWeight: "700",
              }}
            >
              <th>{i + 1}</th>
              {/* <th scope="row">{item.id}</th> */}
              <td>{item.tipo_nombre}</td>
              <td>{item.descripcion}</td>
              <td>{item.documento_resolucion_estado}</td>
              <td>
                <div style={{ display: "flex", textAlign: "center" }}>
                  <div
                    onClick={() => uploadFile(item.id)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <FaUpload size={10} color={"#ffffff"} />
                  </div>
                  {item.archivo !== null && (
                    <div
                      className="text-primary"
                      title="descargar archivo"
                      onClick={() =>
                        DescargarArchivo(`${UrlServer}${item.archivo}`)
                      }
                      style={{
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <FaFileContract size={20} color={"#17a2b8"} />
                    </div>
                  )}
                </div>
                {item.archivo !== null && (
                  <div
                    style={{
                      fontWeight: "100",
                      color: "white",
                    }}
                  >
                    <div>Subido por : </div>
                    <div>{item.usuario_nombre}</div>
                  </div>
                )}
              </td>
              <td></td>
              <td>{fechaFormatoClasico(item.fecha_inicio)}</td>
              <td>{fechaFormatoClasico(item.fecha_final)}</td>
              <td>{item.n_dias}</td>
              <td>{item.plazo_aprobado == 1 ? "Aprobado" : "Sin aprobar"}</td>
              <td>{item.fecha_aprobada}</td>
              <td style={{ display: "flex" }}>
                <PlazosFormulario
                  id_padre={item.id}
                  recarga={activeChildFunctions}
                />
                <PlazosFormularioEdicion
                  data={item}
                  recarga={fetchPLazosPadres}
                />
                <Button
                  color="info"
                  outline
                  onClick={() => deletePlazosPadre(item.id)}
                >
                  <MdDeleteForever />
                </Button>
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
            />,
          ])}
          <tr
            style={{
              fontWeight: 700,
            }}
          >
            <td
              colSpan="6"
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
          </tr>
          <tr
            style={{
              fontWeight: 700,
            }}
          >
            <td
              colSpan="6"
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
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
const PLazosHijos = forwardRef(({ id_padre, count }, ref) => {
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
      <td></td>
      <td></td>
      <td>{fechaFormatoClasico(item.fecha_inicio)}</td>
      <td>{fechaFormatoClasico(item.fecha_final)}</td>
      <td>{item.n_dias}</td>
      <td></td>
      <td>{item.fecha_aprobada}</td>
      <td style={{ display: "flex" }}>
        <PlazosFormularioEdicion data={item} recarga={fetchCargarPlazosHijos} />
        <Button color="info" outline onClick={() => deletePlazosHijos(item.id)}>
          <MdDeleteForever />
        </Button>
      </td>
    </tr>
  ));
});
