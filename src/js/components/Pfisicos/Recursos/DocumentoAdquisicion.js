import React, {
  useEffect,
  useState,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { FechaActual, Redondea } from "../../Utils/Funciones";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  Modal,
  InputGroup,
  InputGroupText,
  Input,
  Button,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { blue } from "@material-ui/core/colors";
import { DebounceInput } from "react-debounce-input";

export default ({ recarga }) => {
  useEffect(() => {
    fetchDocumentosAdquisicion();
  }, []);

  const [DocumentosAdquisicion, setDocumentosAdquisicion] = useState([]);

  async function fetchDocumentosAdquisicion() {
    const res = await axios.get(`${UrlServer}/gettipodocumentoAdquisicion`);
    console.log("-------->", res.data);
    if (Array.isArray(res.data)) {
      setDocumentosAdquisicion(res.data);
    }
  }
  async function fetchDocumentosAdquisicion2() {
    setDocumentosAdquisicion([]);
    const res = await axios.get(`${UrlServer}/gettipodocumentoAdquisicion`);
    console.log("-------->", res.data);
    if (Array.isArray(res.data)) {
      setDocumentosAdquisicion(res.data);
    }
  }

  const [OnHoverDocumento, setOnHoverDocumento] = useState("");

  async function updateRecursoDocumentoAdquisicionPrincipal() {
    setDocumentosAdquisicion([]);
    const res = await axios.post(
      `${UrlServer}/updateRecursoDocumentoAdquisicion`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        tipo: ModalSaveTipo,
        descripcion: ModalSaveDescripcion,
        codigo: ModalSaveCodigo,
        id_tipoDocumentoAdquisicion: ModalSaveIdDocumento,
      }
    );
    fetchDocumentosAdquisicion();
    toggle();
    recarga(ModalSaveDescripcion);
  }

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [ModalSaveDescripcion, setModalSaveDescripcion] = useState("");
  const [ModalSaveTipo, setModalSaveTipo] = useState("");
  const [ModalSaveCodigo, setModalSaveCodigo] = useState("");
  const [ModalSaveIdDocumento, setModalSaveIdDocumento] = useState("");
  return (
    <div>
      {DocumentosAdquisicion.map((item, i) => (
        <Card key={i} className="mb-2">
          <CardHeader
            className="p-1"
            onDragOver={(e) => {
              e.preventDefault();
              setOnHoverDocumento(item.nombre_largo);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              setOnHoverDocumento("");
              console.log("SetOnHover");
              var descripcion = e.dataTransfer.getData("descripcion");
              console.log("descripcion", descripcion);
              var tipo = e.dataTransfer.getData("tipo");
              // updateRecursoDocumentoAdquisicionPrincipal(tipo, descripcion, item.codigo)
              setModalSaveDescripcion(descripcion);
              setModalSaveTipo(tipo);
              setModalSaveIdDocumento(item.id_tipoDocumentoAdquisicion);
              toggle();
            }}
            style={
              OnHoverDocumento == item.nombre_largo
                ? {
                    backgroundColor: "blue",
                  }
                : {
                    backgroundColor: "#242526",
                  }
            }
          >
            {`${item.nombre_largo} `}
            <span className="badge badge-primary">
              <DocumentosAdquisicionTipoCantidad
                id_tipoDocumentoAdquisicion={item.id_tipoDocumentoAdquisicion}
              />
            </span>
          </CardHeader>

          <CardBody>
            <div className="p-1 d-flex flex-wrap">
              <RecursosByTipo
                id_tipoDocumentoAdquisicion={item.id_tipoDocumentoAdquisicion}
                documentoAdquision_nombre={item.nombre}
                recarga={recarga}
                fetchDocumentosAdquisicion2={fetchDocumentosAdquisicion2}
              />
            </div>
          </CardBody>
        </Card>
      ))}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          <DebounceInput
            // value={DocumentoAdquisicion.codigo}
            debounceTimeout={300}
            onChange={(e) => setModalSaveCodigo(e.target.value)}
            type="text"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              updateRecursoDocumentoAdquisicionPrincipal();
            }}
          >
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

function DocumentosAdquisicionTipoCantidad({ id_tipoDocumentoAdquisicion }) {
  useEffect(() => {
    fetchDocumentosAdquisicionTipoCantidad();
    return () => {};
  }, []);

  const [
    DocumentosAdquisicionTipoCantidad,
    setDocumentosAdquisicionTipoCantidad,
  ] = useState([]);

  async function fetchDocumentosAdquisicionTipoCantidad() {
    const res = await axios.post(
      `${UrlServer}/getTipoDocumentoAdquisicionTotal`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        id_tipoDocumentoAdquisicion: id_tipoDocumentoAdquisicion,
      }
    );
    setDocumentosAdquisicionTipoCantidad(res.data.n_elementos);
    console.log("res.data", res.data);
  }

  return <div>{DocumentosAdquisicionTipoCantidad}</div>;
}

function RecursosByTipo({
  id_tipoDocumentoAdquisicion,
  documentoAdquision_nombre,
  recarga,
  fetchDocumentosAdquisicion2,
}) {
  useEffect(() => {
    fetchRecursosByTipoData();
    return () => {};
  }, []);

  const [RecursosByTipoData, setRecursosByTipoData] = useState([]);

  async function fetchRecursosByTipoData() {
    const res = await axios.post(
      `${UrlServer}/getRecursosEjecucionRealByTipoDocumentoAdquisicion`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        id_tipoDocumentoAdquisicion: id_tipoDocumentoAdquisicion,
      }
    );
    setRecursosByTipoData(res.data);
    console.log("res.data---->", res.data);
  }
  // Secccion Modal
  const [modal, setModal] = useState(false);

  const toggle = (codigo) => {
    if (!modal) {
      fetchModalRecursosDetalle(codigo);
      fetchDocumentoAdquisicionData(codigo);
      fetchModalRecursosNuevosDetalle(codigo);
    }
    setModal(!modal);
    setCodigoSeleccionado(codigo);
  };

  const [ModalRecursosDetalle, setModalRecursosDetalle] = useState([]);

  async function fetchModalRecursosDetalle(codigo) {
    const res = await axios.post(
      `${UrlServer}/getRecursosEjecucionRealByTipoAndCodigo`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        id_tipoDocumentoAdquisicion: id_tipoDocumentoAdquisicion,
        codigo: codigo,
      }
    );
    setModalRecursosDetalle(res.data);
    // console.log("res.data fetchModalRecursosDetalle", res.data);
  }

  const [OnHoverCodigo, setOnHoverCodigo] = useState(false);

  async function updateRecursoDocumentoAdquisicion(tipo, descripcion, codigo) {
    const res = await axios.post(
      `${UrlServer}/updateRecursoDocumentoAdquisicion`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        tipo: tipo,
        descripcion: descripcion,
        codigo: codigo,
        id_tipoDocumentoAdquisicion: id_tipoDocumentoAdquisicion,
      }
    );
    fetchRecursosByTipoData();
    recarga(descripcion);
    fetchDocumentosAdquisicion2();
    // setToggleInput(!ToggleInput)
    // fectchDocumentoAdquisicion()
  }

  const [CodigoSeleccionado, setCodigoSeleccionado] = useState(0);

  // Especifica = clasificador presupuestario
  const [SaveEspecifica, setSaveEspecifica] = useState("");

  const [SaveRazonSocial, setSaveRazonSocial] = useState("");
  const [SaveRuc, setSaveRuc] = useState(0);
  const [SaveNombreCodigo, setSaveNombreCodigo] = useState("");
  const [SaveFecha, setSaveFecha] = useState("");
  const [SaveSiaf, setSaveSiaf] = useState("");
  const [SaveNumeroCP, setSaveNumeroCP] = useState("");

  async function SaveData() {
    const res = await axios.post(
      `${UrlServer}/postDocumentoAdquisicionDetalles`,
      {
        razonSocial: SaveRazonSocial,
        RUC: SaveRuc,
        fecha: SaveFecha,
        SIAF: SaveSiaf,
        NCP: SaveNumeroCP,
        id_clasificador_presupuestario: null,
        id_tipoDocumentoAdquisicion: id_tipoDocumentoAdquisicion,
        fichas_id_ficha: sessionStorage.getItem("idobra"),
        codigo: CodigoSeleccionado,
      }
    );
    console.log("save data", res.data);
  }

  const [DocumentoAdquisicionData, setDocumentoAdquisicionData] = useState({});
  async function fetchDocumentoAdquisicionData(codigo) {
    const res = await axios.post(
      `${UrlServer}/getDocumentoAdquisicionDetalles`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        id_tipoDocumentoAdquisicion: 1,
        codigo: "005",
      }
    );
    setSaveRazonSocial(res.data.razonSocial);
    setSaveRuc(res.data.RUC);
    setSaveFecha(res.data.fecha);
    setSaveSiaf(res.data.SIAF);
    setSaveNumeroCP(res.data.NCP);
  }

  // Mostrando nuevos recursos en el modal

  const [ModalRecursosNuevosDetalle, setModalRecursosNuevosDetalle] = useState(
    []
  );

  async function fetchModalRecursosNuevosDetalle(codigo) {
    const res = await axios.post(
      `${UrlServer}/getRecursosEjecucionRealNuevosByTipoAndCodigo`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        id_tipoDocumentoAdquisicion: id_tipoDocumentoAdquisicion,
        codigo: codigo,
      }
    );
    setModalRecursosNuevosDetalle(res.data);
    // console.log("res.data fetchModalRecursosNuevosDetalle", res.data);
  }

  return (
    <div>
      {RecursosByTipoData.map((item, i) => (
        <div
          className="divCodigoRecur"
          key={i}
          // onDragOver={item.bloqueado !== 1 ? (e) => this.onDragOver(e) : ""}
          // onDrop={(e) => { this.onDrop(e, "completado", item.codigo, i, i, item.idDocumento) }}
          onClick={() => toggle(item.codigo)}
          onDragOver={(e) => {
            e.preventDefault();
            setOnHoverCodigo(documentoAdquision_nombre + item.codigo);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            setOnHoverCodigo("");
            // console.log("SetOnHover");
            var descripcion = e.dataTransfer.getData("descripcion");
            // console.log("descripcion", descripcion);
            var tipo = e.dataTransfer.getData("tipo");
            updateRecursoDocumentoAdquisicion(tipo, descripcion, item.codigo);
          }}
          style={
            OnHoverCodigo == documentoAdquision_nombre + item.codigo
              ? {
                  backgroundColor: "blue",
                }
              : {
                  backgroundColor: "#242526",
                }
          }
        >
          {`${documentoAdquision_nombre} ${item.codigo} `}
          <span className="badge badge-primary">{item.n_elementos}</span>
        </div>
      ))}
      <Modal isOpen={modal} toggle={toggle}>
        <div className="table-responsive">
          <div className="clearfix mb-2">
            <div className="h5 float-left">
              {documentoAdquision_nombre + " - " + CodigoSeleccionado}
            </div>

            <button
              type="submit"
              className="float-right mr-2 btn btn-outline-success"
              onClick={() => SaveData()}
            >
              Guardar
            </button>
          </div>

          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupText>ESPECÍFICA</InputGroupText>

            <Input
              onChange={(e) => setSaveEspecifica(e.target.value)}
              placeholder="INGRESE LA ESPECÍFICA ( 1.1.4 2 )"
            />
            <Button outline color="primary">
              BUSCAR
            </Button>
          </InputGroup>

          <div className="d-flex">
            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroupText>RAZÓN SOCIAL</InputGroupText>
              <Input
                onChange={(e) => setSaveRazonSocial(e.target.value)}
                value={SaveRazonSocial}
                placeholder="INGRESE "
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroupText>RUC</InputGroupText>
              <Input
                onChange={(e) => setSaveRuc(e.target.value)}
                value={SaveRuc}
                placeholder="INGRESE"
              />
            </InputGroup>
          </div>

          <div className="d-flex">
            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroupText>nombre codigo</InputGroupText>
              <Input
                onChange={(e) => setSaveNombreCodigo(e.target.value)}
                value={SaveNombreCodigo}
                disabled
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroupText>FECHA</InputGroupText>
              <Input
                onChange={(e) => setSaveFecha(e.target.value)}
                value={SaveFecha}
                type="date"
                placeholder="INGRESE"
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroupText>SIAF</InputGroupText>
              <Input
                onChange={(e) => setSaveSiaf(e.target.value)}
                value={SaveSiaf}
                placeholder="INGRESE"
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroupText>N° C / P</InputGroupText>
              <Input
                onChange={(e) => setSaveNumeroCP(e.target.value)}
                value={SaveNumeroCP}
                placeholder="INGRESE"
              />
            </InputGroup>
          </div>

          <table className="table table-sm table-hover">
            <thead>
              <tr>
                <th>N°</th>
                <th>RECURSO</th>
                <th>UND</th>
                <th>CANTIDAD</th>
                <th>PRECIO S/.</th>
                <th>PARCIAL S/.</th>
              </tr>
            </thead>
            <tbody>
              {ModalRecursosNuevosDetalle.map((item, i) => (
                <tr key={i}>
                  <td>{"N:" + (i + 1)}</td>
                  <td> {item.descripcion} </td>
                  <td> {item.unidad} </td>
                  <td> {item.cantidad} </td>
                  <td> {item.precio} </td>
                  <td> {item.cantidad * item.precio} </td>
                </tr>
              ))}
              {ModalRecursosDetalle.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td> {item.descripcion} </td>
                  <td> {item.unidad} </td>
                  <CantidadAvanzada ModoEditar={true} recurso={item} />
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5">TOTAL</td>
                <td>
                  S/.
                  {/* {TotalParcial} */}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>
    </div>
  );
}
function CantidadAvanzada({ ModoEditar, recurso }) {
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
      <div>{Redondea(Avance)}</div>
    </td>,
    <td>
      <div>
        {recurso.unidad == "%MO" || recurso.unidad == "%PU" ? 0 : Precio}
      </div>
    </td>,
    <td>
      {Redondea(
        Avance *
          (recurso.unidad == "%MO" || recurso.unidad == "%PU" ? 0 : Precio)
      )}
    </td>,
  ];
}
