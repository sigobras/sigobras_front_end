import React, { Component } from "react";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse,
  InputGroup,
  InputGroupText,
  Modal,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import { Picky } from "react-picky";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import "../Comunicados/comunicados.css";

class Comunicados extends Component {
  constructor() {
    super();
    this.state = {
      listaobrasData: [],
      cajacomunicados: [],
      obrasSelecionadas: [],
    };

    this.cargarObras = this.cargarObras.bind(this);
    this.selectObra = this.selectObra.bind(this);
    this.selectinput = this.selectinput.bind(this);
    this.cargarObrasComunicados = this.cargarObrasComunicados.bind(this);
    this.guardarComunicado = this.guardarComunicado.bind(this);
    this.onChangeObra = this.onChangeObra.bind(this);
    this.eliminarcomunicado = this.eliminarcomunicado.bind(this);
  }
  componentWillMount() {
    this.cargarObras();
    this.cargarObrasComunicados();
  }

  /////////FUNCIONES---------------------------------------/8///////////////////////////
  cargarObras() {
    axios
      .post(`${UrlServer}/obrasListaUser`, {
        //"id_acceso": 25    el 25 (idacceso varia de persona en persona por ello el el sessionstorage es donde se guarda el idcceso el id ficha el cargo etc)

        id_acceso: sessionStorage.getItem("idacceso"),
      })
      .then((res) => {
        console.log("ESTA ES LA DATA lista obras", res.data);
        this.setState({
          //setState es para alterar una variable
          listaobrasData: res.data,
        });
      })
      .catch((error) => {
        //si el api manda un error lo registra aqui
        console.log(
          "algo salió mal al tratar de listar las obras error es: ",
          error
        );
      });
  }

  selectObra(id_ficha) {
    this.setState({
      cajaidficha: id_ficha,
    });
  }
  async selectinput(event) {
    await this.setState({ [event.target.name]: event.target.value });
    console.log("state", this.state);
  }

  async guardarComunicado() {
    var obrasSelecionadas = this.state.obrasSelecionadas;
    console.log("obras", obrasSelecionadas);
    var idFichas = [];
    for (let i = 0; i < obrasSelecionadas.length; i++) {
      var unaobra = obrasSelecionadas[i];
      idFichas.push([unaobra.id_ficha]);
    }
    // console.log("idficha", idFichas);

    await axios
      .post(
        `${UrlServer}/comunicados`,

        {
          fecha_inicial: this.state.fecha_inicial,
          fecha_final: this.state.fecha_final,
          texto_mensaje: this.state.comunicado,
          id_fichas: idFichas,
        }
      )
      .then((res) => {
        // console.log("ESTA ES LA DATA lista obras", res.data);

        alert("data guardada");
      })
      .catch((error) => {
        //si el api manda un error lo registra aqui
        // console.log('algo salió mal al tratar de listar las obras error es: ', error);
        alert("data no guardada");
      });

    this.cargarObrasComunicados(); //para actualizar la lista de momunicados
  }

  cargarObrasComunicados() {
    axios
      .post(`${UrlServer}/listaComunicados`, {
        id_acceso: sessionStorage.getItem("idacceso"),
      })
      .then((res) => {
        console.log("comunicados", res.data);
        this.setState({
          cajacomunicados: res.data,
        });
      })
      .catch((error) => {
        console.log(
          "algo salió mal al tratar de listar las obras error es: ",
          error
        );
      });
  }

  onChangeObra(valor) {
    console.log("data valor ", valor);
    this.setState({ obrasSelecionadas: valor });
  }

  async eliminarcomunicado(idcomunicados) {
    if (
      confirm(
        "Al realizar esta acción no se podrá recuperar el comunicado, está seguro?"
      )
    ) {
      await axios
        .post(`${UrlServer}/eliminarcomunicado`, {
          idcomunicados: idcomunicados,
        })
        .then((res) => {
          console.log("comunicados", res.data);
        })
        .catch((error) => {
          console.log(
            "algo salió mal al tratar de listar las obras error es: ",
            error
          );
        });

      this.cargarObrasComunicados(); //para que se recargue los comunicados
    } else {
    }
  }

  render() {
    return (
      <div>
        {/* <select className="selectcomunicados" onChange={event => this.selectObra(event.target.value)}>
                    <option>Seleccione la obra</option>
                    {this.state.listaobrasData.map((lista, index) =>     //HACE INTERACCION CON UN SOLO ELEMENTO

                        <option key={index} value={lista.id_ficha}>{lista.codigo}</option>
                    )}
                </select> */}
        <Label for="A">OBRAS:</Label>

        <Picky
          value={this.state.obrasSelecionadas}
          options={this.state.listaobrasData}
          onChange={this.onChangeObra}
          open={false}
          valueKey="id_ficha"
          labelKey="codigo"
          multiple={true}
          includeSelectAll={true}
          includeFilter={true}
          dropdownHeight={200}
          placeholder={"No hay datos seleccionados"}
          allSelectedPlaceholder={"seleccionaste todo"}
          manySelectedPlaceholder={"tienes %s seleccionados"}
          className="text-dark"
          selectAllText="Todos"
        />

        <div>COMUNICADO:</div>

        <form className="form">
          <input
            name="comunicado"
            type="text"
            required
            autocomplete="off"
            onChange={(event) => this.selectinput(event)}
          />

          <label className="lbl-nombre"></label>
        </form>
        <input
          name="fecha_inicial"
          type="date"
          onChange={(event) => this.selectinput(event)}
        />
        <input
          name="fecha_final"
          type="date"
          onChange={(event) => this.selectinput(event)}
        />

        <button
          className="botoncomu"
          onClick={(event) => this.guardarComunicado()}
        >
          GUARDAR
        </button>

        <div>
          <table className="tablacomu table-hover">
            <thead>
              <tr>
                <td></td>
                <td>CODIGO</td>
                <td>FECHA INICIAL</td>
                <td>FECHA FINAL</td>
                <td>COMUNICADO</td>
              </tr>
            </thead>

            <tbody className="text-center">
              {this.state.cajacomunicados.map((comunicado, index) => (
                <tr key={index}>
                  <td>
                    <button
                      onClick={() =>
                        this.eliminarcomunicado(comunicado.idcomunicados)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                  <td>{comunicado.codigo}</td>
                  <td>{comunicado.fecha_inicial}</td>
                  <td>{comunicado.fecha_final}</td>
                  <td>{comunicado.texto_mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default Comunicados;
