import React, {
  useEffect,
  useState,
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  InputGroupText,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Button,
  Input,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { FechaActual, Redondea } from "../../Utils/Funciones";
import {
  MdFirstPage,
  MdChevronLeft,
  MdChevronRight,
  MdLastPage,
  MdCompareArrows,
  MdClose,
  MdSearch,
  MdExtension,
  MdVisibility,
  MdMonetizationOn,
  MdWatch,
  MdLibraryBooks,
  MdSave,
  MdModeEdit,
  MdEdit,
} from "react-icons/md";
import { FaSuperpowers, FaPlus } from "react-icons/fa";
import { DebounceInput } from "react-debounce-input";
import DocumentoAdquisicion from "./DocumentoAdquisicion";
import "./RecursosObraResumen.css";
import { ToastContainer, toast } from "react-toastify";

export default () => {
  useEffect(() => {
    fectchRecursosTipo();
    fetchTipoDocumentoAdquisicion();
    fetchUsuarioData();
  }, []);
  // ------------------------------------> Materiles

  const [RecursosTipo, setRecursosTipo] = useState([]);
  async function fectchRecursosTipo() {
    const res = await axios.post(`${UrlServer}/getmaterialesResumenTipos`, {
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setRecursosTipo(res.data);
    onChangeRecursoTiposSeleccionado(res.data[0]);
    // console.log("res.dataMateriales", res.data);
  }
  const [RecursoTipoSelecccionado, setRecursoTipoSelecccionado] = useState({});
  function onChangeRecursoTiposSeleccionado(RecursoTipo) {
    setRecursoTipoSelecccionado(RecursoTipo);
    // console.log("onChangeRecursoTiposSeleccionado");
  }

  // --------------------------> Recursos

  const [Recursos, setRecursos] = useState([]);

  async function fectchRecursos() {
    const res = await axios.post(`${UrlServer}/getResumenRecursos`, {
      id_ficha: sessionStorage.getItem("idobra"),
      tipo: RecursoTipoSelecccionado.tipo,
      texto_buscar: TextoBuscado,
      inicio: (PaginaActual - 1) * CantidadPaginasRecursos,
      cantidad_datos: Number(CantidadPaginasRecursos),
    });

    setRecursos(res.data);
  }
  async function fectchRecursos2() {
    console.log("Activandose");
    setRecursos([]);
    const res = await axios.post(`${UrlServer}/getResumenRecursos`, {
      id_ficha: sessionStorage.getItem("idobra"),
      tipo: RecursoTipoSelecccionado.tipo,
      texto_buscar: TextoBuscado,
      inicio: (PaginaActual - 1) * CantidadPaginasRecursos,
      cantidad_datos: Number(CantidadPaginasRecursos),
    });

    setRecursos(res.data);
  }
  function updateRecurso(index, avance) {
    var clone = [...Recursos];
    clone[index].avance = avance;
    setRecursos(clone);
  }

  // --------------->Paginacion
  const [CantidadPaginasRecursos, setCantidadPaginasRecursos] = useState(15);
  async function onChangeCantidadPaginasRecursos(value) {
    setCantidadPaginasRecursos(value);
  }
  const [PaginaActual, setPaginaActual] = useState(1);
  function onChangePaginaActual(pagina) {
    setPaginaActual(pagina);
  }
  const [TextoBuscado, setTextoBuscado] = useState("");
  const [ConteoRecursos, setConteoRecursos] = useState([]);
  async function fectchConteoRecursos() {
    const request = await axios.post(
      `${UrlServer}/getResumenRecursosConteoDatos`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        tipo: RecursoTipoSelecccionado.tipo,
        texto_buscar: TextoBuscado,
      }
    );
    setConteoRecursos(request.data.total);
  }

  const [TipoDocumentoAdquisicion, setTipoDocumentoAdquisicion] = useState([]);
  const [
    InputRecursoTipoDocumentoAdquisicion,
    setInputRecursoTipoDocumentoAdquisicion,
  ] = useState("SELECCIONE");
  async function fetchTipoDocumentoAdquisicion() {
    const res = await axios.get(`${UrlServer}/gettipodocumentoadquisicion`);
    setTipoDocumentoAdquisicion(res.data);
  }
  const [ModoEditar, setModoEditar] = useState(false);

  function toggleModoEditar() {
    setModoEditar(!ModoEditar);
    // fectchRecursos()
  }
  useEffect(() => {
    setPaginaActual(1);
  }, [RecursoTipoSelecccionado, TextoBuscado]);
  useEffect(() => {
    fectchConteoRecursos();
  }, [RecursoTipoSelecccionado, TextoBuscado]);
  useEffect(() => {
    fectchRecursos();
    fetchRecursosNuevos();
  }, [
    ModoEditar,
    CantidadPaginasRecursos,
    RecursoTipoSelecccionado,
    PaginaActual,
    TextoBuscado,
  ]);

  //Activar funciones de hermanitos
  const [RefComprobante, setRefComprobante] = useState([]);

  function activeChildFunctions(descripcion) {
    console.log("Activando---->");
    RefComprobante[descripcion].recarga();
  }

  const [InterfazDocumentoAdquisicion, setInterfazDocumentoAdquisicion] =
    useState(false);

  /// COmponente para formulario de recursos nuevos
  const refRecursoFormulario = useRef(null);
  const RecursoFormulario = forwardRef(
    ({ ToggleFormularioRecursoNuevo, fetchRecursosNuevos }, ref) => {
      useImperativeHandle(ref, () => ({
        save() {
          updateRecursosFormulario();
        },
      }));

      const [NuevoComprobante, setNuevoComprobante] = useState("");
      const [NuevoRecurso, setNuevoRecurso] = useState("");
      const [NuevoUnidad, setNuevoUnidad] = useState("");
      const [NuevoCantidad, setNuevoCantidad] = useState(0);
      const [NuevoPrecio, setNuevoPrecio] = useState(0);
      const [NuevoParcial, setNuevoParcial] = useState("");
      const [NuevoDiferencia, setNuevoDiferencia] = useState("");
      const [NuevoDiferenciaPorcentaje, setNuevoDiferenciaPorcentaje] =
        useState("");

      const [NuevoSelectRecursosFormulario, setNuevoSelectRecursosFormulario] =
        useState("SELECCIONE");

      // const [UpdateRecursosFormulario, setUpdateRecursosFormulario] = useState([])
      async function updateRecursosFormulario() {
        try {
          const res = await axios.post(`${UrlServer}/postNuevoRecursoReal`, {
            fichas_id_ficha: sessionStorage.getItem("idobra"),
            tipo: RecursoTipoSelecccionado.tipo,
            id_tipoDocumentoAdquisicion: NuevoSelectRecursosFormulario,
            codigo: NuevoComprobante,
            descripcion: NuevoRecurso,
            unidad: NuevoUnidad,
            cantidad: NuevoCantidad,
            precio: NuevoPrecio,
          });
          // setUpdateRecursosFormulario(res.data)
          console.log("updateRecursosFormulario", res.data);
          ToggleFormularioRecursoNuevo(false);
          fetchRecursosNuevos();
        } catch (error) {
          toast.error("No se pudo realizar el ingreso del nuevo recurso", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }

      return (
        <tr>
          <td>
            <div className="d-flex">
              <DebounceInput
                // value={DocumentoAdquisicion.codigo}
                debounceTimeout={300}
                onChange={(e) => setNuevoComprobante(e.target.value)}
                type="text"
              />

              <select
                onChange={(e) =>
                  setNuevoSelectRecursosFormulario(e.target.value)
                }
                value={NuevoSelectRecursosFormulario}
                className="form-control form-control-sm"
                style={{ width: "120px" }}
              >
                <option disabled hidden>
                  SELECCIONE
                </option>
                {TipoDocumentoAdquisicion.map((item, i) => (
                  <option value={item.id_tipoDocumentoAdquisicion}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>
          </td>
          <td>
            <Input
              size="sm"
              className="mb-2 px-1"
              placeholder="RECURSO"
              onChange={(e) => setNuevoRecurso(e.target.value)}
              value={NuevoRecurso}
            />
          </td>
          <td>
            <Input
              size="sm"
              className="mb-2 px-1"
              placeholder="UNIDAD"
              onChange={(e) => setNuevoUnidad(e.target.value)}
              value={NuevoUnidad}
            />
          </td>
          <td>
            <Input
              size="sm"
              className="mb-2 px-1"
              placeholder="CANTIDAD"
              onChange={(e) => setNuevoCantidad(e.target.value)}
              value={NuevoCantidad}
            />
          </td>
          <td>
            <Input
              size="sm"
              className="mb-2 px-1"
              placeholder="PRECIO"
              onChange={(e) => setNuevoPrecio(e.target.value)}
              value={NuevoPrecio}
            />
          </td>
          {/* <td>
                    <Input
                        size="sm" className="mb-2 px-1"
                        placeholder="PARCIAL"
                        onChange={e => setNuevoParcial(e.target.value)}
                        value={NuevoParcial}
                    />
                </td>
                <td>
                    <Input
                        size="sm" className="mb-2 px-1"
                        placeholder="DIFERENCIA"
                        onChange={e => setNuevoDiferencia(e.target.value)}
                        value={NuevoDiferencia}
                    />
                </td>
                <td>
                    <Input
                        size="sm" className="mb-2 px-1"
                        placeholder="%"
                        onChange={e => setNuevoDiferenciaPorcentaje(e.target.value)}
                        value={NuevoDiferenciaPorcentaje}
                    />
                </td> */}
        </tr>
      );
    }
  );

  // Recursos nuevos
  const [RecursosNuevos, setRecursosNuevos] = useState([]);
  async function fetchRecursosNuevos() {
    console.log("Axios", {
      id_ficha: sessionStorage.getItem("idobra"),
      tipo: RecursoTipoSelecccionado.tipo,
      texto_buscar: TextoBuscado,
      inicio: (PaginaActual - 1) * CantidadPaginasRecursos,
      cantidad_datos: Number(CantidadPaginasRecursos),
    });
    const res = await axios.post(`${UrlServer}/getResumenRecursosNuevos`, {
      id_ficha: sessionStorage.getItem("idobra"),
      tipo: RecursoTipoSelecccionado.tipo,
      texto_buscar: TextoBuscado,
      inicio: (PaginaActual - 1) * CantidadPaginasRecursos,
      cantidad_datos: Number(CantidadPaginasRecursos),
    });
    setRecursosNuevos(res.data);
    console.log("fetchRecursosNuevos", res.data);
  }

  const [ToggleFormularioRecursoNuevo, setToggleFormularioRecursoNuevo] =
    useState(false);
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
      <Nav tabs>
        {RecursosTipo.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              className={RecursoTipoSelecccionado.tipo == item.tipo && "active"}
              onClick={() => onChangeRecursoTiposSeleccionado(item)}
            >
              {item.tipo}
              {/* {console.log("MaterialesSelecccionado.tipo",MaterialesSelecccionado.tipo)} */}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <Row>
        <Col xs="12">
          <div className="float-right">
            <InputGroup size="sm">
              {ModoEditar && (
                <Fragment>
                  {ToggleFormularioRecursoNuevo && (
                    <Button
                      outline
                      color="success"
                      onClick={() => {
                        console.log(
                          "refRecursoFormulario",
                          refRecursoFormulario
                        );
                        refRecursoFormulario.current.save();
                      }}
                    >
                      <MdSave />
                    </Button>
                  )}

                  <Button
                    outline
                    color="info"
                    onClick={() =>
                      setToggleFormularioRecursoNuevo(
                        !ToggleFormularioRecursoNuevo
                      )
                    }
                  >
                    <FaPlus />
                  </Button>
                </Fragment>
              )}
              {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                UsuarioData.cargo_nombre == "ADMINISTRADOR GENERAL") && (
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    if (ModoEditar) {
                      setInterfazDocumentoAdquisicion(false);
                    }
                    toggleModoEditar();
                  }}
                  title="asignar codigos y editar "
                >
                  <MdCompareArrows /> <MdModeEdit />
                </Button>
              )}
              {ModoEditar && (
                <Button
                  outline
                  color="info"
                  onClick={() =>
                    setInterfazDocumentoAdquisicion(
                      !InterfazDocumentoAdquisicion
                    )
                  }
                  title="organizar"
                >
                  <MdExtension />
                </Button>
              )}
              <Input
                type="text"
                onChange={(event) => setTextoBuscado(event.target.value)}
              />
            </InputGroup>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={InterfazDocumentoAdquisicion ? 9 : 12}>
          <table className="table table-sm table-hover">
            <thead>
              <tr>
                <th
                  colSpan={InterfazDocumentoAdquisicion ? 3 : 6}
                  className="bordeDerecho"
                >
                  RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO
                </th>
                <th colSpan="5">
                  {" "}
                  RECURSOS GASTADOS HASTA LA FECHA ( HOY {FechaActual()} )
                </th>
              </tr>
              <tr>
                <th>N° O/C - O/S</th>
                <th>RECURSO</th>
                <th>UND</th>
                {!InterfazDocumentoAdquisicion && [
                  <th>CANTIDAD</th>,
                  <th>PRECIO S/.</th>,
                  <th className="bordeDerecho"> PARCIAL S/.</th>,
                ]}
                <th>CANTIDAD</th>
                <th>PRECIO S/.</th>
                <th>PARCIAL S/.</th>
                <th>DIFERENCIA</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {ModoEditar && ToggleFormularioRecursoNuevo && (
                <RecursoFormulario
                  ref={refRecursoFormulario}
                  ToggleFormularioRecursoNuevo={setToggleFormularioRecursoNuevo}
                  fetchRecursosNuevos={fetchRecursosNuevos}
                />
              )}
              {RecursosNuevos.map((item, i) => (
                <tr
                  key={item.descripcion}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("descripcion", item.descripcion);
                    e.dataTransfer.setData("tipo", RecursoTipoSelecccionado);
                  }}
                >
                  <td>
                    <Comprobante
                      ModoEditar={ModoEditar}
                      TipoDocumentoAdquisicion={TipoDocumentoAdquisicion}
                      recurso={item}
                      RecursoTipoSelecccionado={RecursoTipoSelecccionado}
                      ref={(ref) => {
                        var clone = RefComprobante;
                        clone[item.descripcion] = ref;
                        setRefComprobante(clone);
                      }}
                    />
                  </td>

                  <EditarRecursoNuevo recurso={item} ModoEditar={ModoEditar} />

                  {/* <td>
                                            {item.unidad} </td>
                                        {
                                            !InterfazDocumentoAdquisicion &&
                                            [
                                                <td> {Redondea(item.cantidad)}</td>,
                                                <td> {item.precio}</td>,
                                                <td className="bordeDerecho"> {Redondea(item.cantidad * item.precio)}</td>
                                            ]
                                        }
                                        <td> {item.unidad} </td> */}
                </tr>
              ))}
              {Recursos.map((item, i) => (
                <tr
                  key={item.descripcion}
                  draggable
                  onDragStart={(e) => {
                    console.log("item.descripcion", item.descripcion);
                    e.dataTransfer.setData("descripcion", item.descripcion);
                    e.dataTransfer.setData("tipo", RecursoTipoSelecccionado);
                  }}
                >
                  <td>
                    <Comprobante
                      ModoEditar={ModoEditar}
                      TipoDocumentoAdquisicion={TipoDocumentoAdquisicion}
                      recurso={item}
                      RecursoTipoSelecccionado={RecursoTipoSelecccionado}
                      ref={(ref) => {
                        var clone = RefComprobante;
                        clone[item.descripcion] = ref;
                        setRefComprobante(clone);
                      }}
                    />
                  </td>
                  <td> {item.descripcion} </td>
                  <td> {item.unidad} </td>
                  {!InterfazDocumentoAdquisicion && [
                    <td> {Redondea(item.recurso_cantidad)}</td>,
                    <td>
                      {" "}
                      {item.unidad == "%MO" || item.unidad == "%PU"
                        ? 0
                        : item.precio}
                    </td>,
                    <td className="bordeDerecho">
                      {" "}
                      {Redondea(
                        item.recurso_cantidad *
                          (item.unidad == "%MO" || item.unidad == "%PU"
                            ? 0
                            : item.precio)
                      )}
                    </td>,
                  ]}
                  <CantidadAvanzada
                    key={item.descripcion + ModoEditar}
                    ModoEditar={ModoEditar}
                    RecursoTipoSelecccionado={RecursoTipoSelecccionado}
                    recurso={item}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
        {InterfazDocumentoAdquisicion && (
          <Col xs="3">
            <DocumentoAdquisicion recarga={activeChildFunctions} />
          </Col>
        )}
      </Row>

      <div className="float-left">
        <select
          onChange={(e) => onChangeCantidadPaginasRecursos(e.target.value)}
          value={CantidadPaginasRecursos}
          className="form-control form-control-sm"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="float-right mr-2 ">
        <div className="d-flex text-dark">
          <InputGroup size="sm">
            <Button
              className="btn btn-light pt-0"
              onClick={() => onChangePaginaActual(PaginaActual - 1)}
              disabled={PaginaActual <= 1}
            >
              <MdChevronLeft />
            </Button>
            <input
              type="text"
              style={{ width: "30px" }}
              value={PaginaActual}
              // disabled
              onChange={(event) => setPaginaActual(event.target.value)}
            />
            <InputGroupText>
              {`de  ${Math.ceil(ConteoRecursos / CantidadPaginasRecursos)}`}
            </InputGroupText>

            <Button
              className="btn btn-light pt-0"
              onClick={() => onChangePaginaActual(PaginaActual + 1)}
              disabled={
                PaginaActual >=
                Math.ceil(ConteoRecursos / CantidadPaginasRecursos)
              }
            >
              <MdChevronRight />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};
//Destructuracion

const Comprobante = forwardRef(
  (
    { ModoEditar, TipoDocumentoAdquisicion, recurso, RecursoTipoSelecccionado },
    ref
  ) => {
    useEffect(() => {
      fectchDocumentoAdquisicion();
    }, []);

    useImperativeHandle(ref, () => ({
      recarga() {
        fectchDocumentoAdquisicion();
      },
    }));

    const [DocumentoAdquisicion, setDocumentoAdquisicion] = useState({});

    async function fectchDocumentoAdquisicion() {
      const ejecucionReal = await axios.post(
        `${UrlServer}/getResumenRecursosRealesByDescripcion`,
        {
          id_ficha: sessionStorage.getItem("idobra"),
          descripcion: recurso.descripcion,
        }
      );
      setDocumentoAdquisicion(ejecucionReal.data);
      if (ejecucionReal.data) {
        // console.log("setInput2", ejecucionReal.data);
        setInput2(ejecucionReal.data.id_tipoDocumentoAdquisicion);
      }
    }

    const [ToggleInput, setToggleInput] = useState(false);
    // Edicion
    const [Input, setInput] = useState();
    const [Input2, setInput2] = useState("SELECCIONE");

    async function saveData() {
      const res = await axios.post(
        `${UrlServer}/updateRecursoDocumentoAdquisicion`,
        {
          id_ficha: sessionStorage.getItem("idobra"),
          tipo: RecursoTipoSelecccionado.tipo,
          descripcion: recurso.descripcion,
          codigo: Input,
          id_tipoDocumentoAdquisicion: Input2,
        }
      );
      setToggleInput(!ToggleInput);
      fectchDocumentoAdquisicion();
    }

    return ModoEditar && ToggleInput ? (
      <div className="d-flex">
        <DebounceInput
          value={DocumentoAdquisicion.codigo}
          debounceTimeout={300}
          onChange={(e) => setInput(e.target.value)}
          type="text"
        />

        <select
          onChange={(e) => setInput2(e.target.value)}
          value={Input2}
          className="form-control form-control-sm"
          style={{ width: "120px" }}
        >
          <option disabled hidden>
            SELECCIONE
          </option>
          {TipoDocumentoAdquisicion.map((item, i) => (
            <option value={item.id_tipoDocumentoAdquisicion}>
              {item.nombre}
            </option>
          ))}
        </select>
        <div onClick={() => saveData()}>
          <MdSave style={{ cursor: "pointer" }} />
        </div>
        <div onClick={() => setToggleInput(!ToggleInput)}>
          <MdClose style={{ cursor: "pointer" }} />
        </div>
      </div>
    ) : (
      <div
        className="d-flex showhim"
        // style={ModoEditar ? {backgroundColor: '#63637d'}: {}}
      >
        {TipoDocumentoAdquisicion.find(
          (item2) =>
            item2.id_tipoDocumentoAdquisicion ===
            DocumentoAdquisicion.id_tipoDocumentoAdquisicion
        ) &&
          TipoDocumentoAdquisicion.find(
            (item2) =>
              item2.id_tipoDocumentoAdquisicion ===
              DocumentoAdquisicion.id_tipoDocumentoAdquisicion
          ).nombre}
        {" - "}
        {DocumentoAdquisicion.codigo}
        {ModoEditar && (
          <MdModeEdit
            className="showme"
            onClick={() => setToggleInput(!ToggleInput)}
          />
        )}
      </div>
    );
  }
);

function EditarRecursoNuevo({ recurso, ModoEditar }) {
  async function updateRecursoNuevo() {
    const res = await axios.post(
      `${UrlServer}/postNuevoRecursoReal`,
      InputRecursoNuevo
    );
    console.log(res.data);
    setToggleInputDescripcionNuevo(false);
    setToggleInputUnidadNuevo(false);
    setToggleInputCantidadNuevo(false);
    setToggleInputPrecioNuevo(false);
    if (res.data.message == "ingreso exitoso") {
      setInputRecursoNuevoOriginal(InputRecursoNuevo);
    }
  }

  //Descripcion
  const [InputRecursoNuevoOriginal, setInputRecursoNuevoOriginal] = useState({
    ...recurso,
  });
  const [InputRecursoNuevo, setInputRecursoNuevo] = useState({ ...recurso });
  const [ToggleInputDescripcionNuevo, setToggleInputDescripcionNuevo] =
    useState(false);
  const [ToggleInputUnidadNuevo, setToggleInputUnidadNuevo] = useState(false);
  const [ToggleInputCantidadNuevo, setToggleInputCantidadNuevo] =
    useState(false);
  const [ToggleInputPrecioNuevo, setToggleInputPrecioNuevo] = useState(false);

  //Unidad
  return [
    <td>
      {ModoEditar && ToggleInputDescripcionNuevo ? (
        <div className="d-flex">
          <DebounceInput
            value={InputRecursoNuevo.descripcion}
            debounceTimeout={300}
            onChange={(e) => {
              var clone = { ...InputRecursoNuevo };
              clone.descripcion = e.target.value;
              setInputRecursoNuevo(clone);
            }}
            type="text"
          />
          <div onClick={() => updateRecursoNuevo()}>
            <MdSave style={{ cursor: "pointer" }} />
          </div>
          <div
            onClick={() =>
              setToggleInputDescripcionNuevo(!ToggleInputDescripcionNuevo)
            }
          >
            <MdClose style={{ cursor: "pointer" }} />
          </div>
        </div>
      ) : (
        <div className="d-flex showhim">
          {InputRecursoNuevoOriginal.descripcion}
          {ModoEditar && (
            <MdModeEdit
              className="showme"
              onClick={() => {
                if (
                  confirm(
                    "La edicion de descripcion conllevara a la creacion de un nuevo recurso, manteniendo el creado originalmente, esta Ud. seguro de continuar ?"
                  )
                ) {
                  setToggleInputDescripcionNuevo(!ToggleInputDescripcionNuevo);
                }
              }}
            />
          )}
        </div>
      )}
    </td>,
    <td>
      {ModoEditar && ToggleInputUnidadNuevo ? (
        <div className="d-flex">
          <DebounceInput
            value={InputRecursoNuevo.unidad}
            debounceTimeout={300}
            onChange={(e) => {
              var clone = { ...InputRecursoNuevo };
              clone.unidad = e.target.value;
              setInputRecursoNuevo(clone);
            }}
            type="text"
          />
          <div onClick={() => updateRecursoNuevo()}>
            <MdSave style={{ cursor: "pointer" }} />
          </div>
          <div
            onClick={() => setToggleInputUnidadNuevo(!ToggleInputUnidadNuevo)}
          >
            <MdClose style={{ cursor: "pointer" }} />
          </div>
        </div>
      ) : (
        <div className="d-flex showhim">
          {InputRecursoNuevoOriginal.unidad}
          {ModoEditar && (
            <MdModeEdit
              className="showme"
              onClick={() => setToggleInputUnidadNuevo(!ToggleInputUnidadNuevo)}
            />
          )}
        </div>
      )}
    </td>,
    <td>
      {ModoEditar && ToggleInputCantidadNuevo ? (
        <div className="d-flex">
          <DebounceInput
            value={InputRecursoNuevo.cantidad}
            debounceTimeout={300}
            onChange={(e) => {
              var clone = { ...InputRecursoNuevo };
              clone.cantidad = e.target.value;
              setInputRecursoNuevo(clone);
            }}
            type="text"
          />
          <div onClick={() => updateRecursoNuevo()}>
            <MdSave style={{ cursor: "pointer" }} />
          </div>
          <div
            onClick={() =>
              setToggleInputCantidadNuevo(!ToggleInputCantidadNuevo)
            }
          >
            <MdClose style={{ cursor: "pointer" }} />
          </div>
        </div>
      ) : (
        <div className="d-flex showhim">
          {InputRecursoNuevoOriginal.cantidad}
          {ModoEditar && (
            <MdModeEdit
              className="showme"
              onClick={() =>
                setToggleInputCantidadNuevo(!ToggleInputCantidadNuevo)
              }
            />
          )}
        </div>
      )}
    </td>,
    <td>
      {ModoEditar && ToggleInputPrecioNuevo ? (
        <div className="d-flex">
          <DebounceInput
            value={InputRecursoNuevo.precio}
            debounceTimeout={300}
            onChange={(e) => {
              var clone = { ...InputRecursoNuevo };
              clone.precio = e.target.value;
              setInputRecursoNuevo(clone);
            }}
            type="text"
          />
          <div onClick={() => updateRecursoNuevo()}>
            <MdSave style={{ cursor: "pointer" }} />
          </div>
          <div
            onClick={() => setToggleInputPrecioNuevo(!ToggleInputPrecioNuevo)}
          >
            <MdClose style={{ cursor: "pointer" }} />
          </div>
        </div>
      ) : (
        <div className="d-flex showhim">
          {InputRecursoNuevoOriginal.precio}
          {ModoEditar && (
            <MdModeEdit
              className="showme"
              onClick={() => setToggleInputPrecioNuevo(!ToggleInputPrecioNuevo)}
            />
          )}
        </div>
      )}
    </td>,
    <td>
      {Redondea(
        InputRecursoNuevoOriginal.cantidad * InputRecursoNuevoOriginal.precio
      )}
    </td>,
  ];
}

const CantidadAvanzada = forwardRef(
  ({ ModoEditar, RecursoTipoSelecccionado, recurso }, ref) => {
    useEffect(() => {
      fectchAvance();
    }, []);

    // Seccion de Avanze
    const [Avance, setAvance] = useState(0);
    const [Precio, setPrecio] = useState(0);

    async function fectchAvance() {
      const ejecucionReal = await axios.post(
        `${UrlServer}/getResumenRecursosRealesByDescripcion`,
        {
          id_ficha: sessionStorage.getItem("idobra"),
          descripcion: recurso.descripcion,
        }
      );

      // console.log("res.dataAvance", res.data);
      var avance = null;
      if (ModoEditar) {
        avance = ejecucionReal.data.cantidad;
      }

      if (avance == null) {
        const res3 = await axios.post(
          `${UrlServer}/getResumenRecursosCantidadByDescripcion`,
          {
            id_ficha: sessionStorage.getItem("idobra"),
            descripcion: recurso.descripcion,
          }
        );
        avance = res3.data.avance;
      }
      setAvance(avance);

      var precio = recurso.precio;
      if (ModoEditar && ejecucionReal.data.precio != null) {
        precio = ejecucionReal.data.precio;
      }
      setPrecio(precio);
    }

    //Edicion de avance

    const [ToggleInputAvance, setToggleInputAvance] = useState(false);
    const [InputAvance, setInputAvance] = useState();
    async function updateRecursoAvance() {
      const res = await axios.post(`${UrlServer}/updateRecursoAvance`, {
        id_ficha: sessionStorage.getItem("idobra"),
        tipo: RecursoTipoSelecccionado.tipo,
        descripcion: recurso.descripcion,
        cantidad: InputAvance,
      });

      setToggleInputAvance(!ToggleInputAvance);
      fectchAvance();
    }

    const [ToggleInputPrecio, setToggleInputPrecio] = useState(false);
    const [InputPrecio, setInputPrecio] = useState();

    async function updateRecursoPrecio() {
      const res = await axios.post(`${UrlServer}/updateRecursoPrecio`, {
        id_ficha: sessionStorage.getItem("idobra"),
        tipo: RecursoTipoSelecccionado.tipo,
        descripcion: recurso.descripcion,
        precio: InputPrecio,
      });
      setToggleInputPrecio(!ToggleInputPrecio);
      fectchAvance();
    }

    return [
      <td>
        {ToggleInputAvance ? (
          <div className="d-flex">
            <DebounceInput
              value={Avance}
              debounceTimeout={300}
              onChange={(e) => setInputAvance(e.target.value)}
              type="number"
            />
            <div onClick={() => updateRecursoAvance()}>
              <MdSave style={{ cursor: "pointer" }} />
            </div>
            <div onClick={() => setToggleInputAvance(!ToggleInputAvance)}>
              <MdClose style={{ cursor: "pointer" }} />
            </div>
          </div>
        ) : (
          <div className="d-flex showhim">
            {Redondea(Avance)}
            {ModoEditar && (
              <MdModeEdit
                className="showme"
                onClick={() => setToggleInputAvance(!ToggleInputAvance)}
              />
            )}
          </div>
        )}
      </td>,
      <td>
        {ToggleInputPrecio ? (
          <div className="d-flex">
            <DebounceInput
              value={Precio}
              debounceTimeout={300}
              onChange={(e) => setInputPrecio(e.target.value)}
              type="number"
            />
            <div onClick={() => updateRecursoPrecio()}>
              <MdSave style={{ cursor: "pointer" }} />
            </div>
            <div onClick={() => setToggleInputPrecio(!ToggleInputPrecio)}>
              <MdClose style={{ cursor: "pointer" }} />
            </div>
          </div>
        ) : (
          <div className="d-flex showhim">
            {recurso.unidad == "%MO" || recurso.unidad == "%PU" ? 0 : Precio}
            {ModoEditar && (
              <MdModeEdit
                className="showme"
                onClick={() => setToggleInputPrecio(!ToggleInputPrecio)}
              />
            )}
          </div>
        )}
      </td>,
      <td>
        {Redondea(
          Avance *
            (recurso.unidad == "%MO" || recurso.unidad == "%PU" ? 0 : Precio)
        )}
      </td>,
      <td>
        {Redondea(
          recurso.recurso_cantidad *
            (recurso.unidad == "%MO" || recurso.unidad == "%PU"
              ? 0
              : recurso.precio) -
            Avance *
              (recurso.unidad == "%MO" || recurso.unidad == "%PU" ? 0 : Precio)
        )}
      </td>,
      <td>
        {Redondea(
          ((recurso.recurso_cantidad *
            (recurso.unidad == "%MO" || recurso.unidad == "%PU"
              ? 0
              : recurso.precio) -
            Avance *
              (recurso.unidad == "%MO" || recurso.unidad == "%PU"
                ? 0
                : Precio)) /
            (recurso.recurso_cantidad *
              (recurso.unidad == "%MO" || recurso.unidad == "%PU"
                ? 0
                : recurso.precio))) *
            100
        )}
      </td>,
    ];
  }
);
