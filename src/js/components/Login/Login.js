import React, { Component } from 'react';
import { Collapse, Button, CardHeader, CardBody, Card, Spinner, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { ToastContainer, toast } from "react-toastify";
import { TiArrowSortedDown } from "react-icons/ti";
import axios from 'axios'
import Slider from "./Slider"
import { UrlServer } from '../Utils/ServerUrlConfig'
import LogoSigobras from '../../../images/sigobras-neon.jpg'
import '../../../css/login.css'

// import MultiFilter from "./MultiFilter"

class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      pass: '',
      nombAcceso: '',
      sesionCargo: '',
      Loginsms: '',
      alert: '',
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //  console.log(sessionStorage.getItem("api"));	
    // console.log(window.location.port)
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ isLoading: true });
    axios.post(UrlServer + '/login', {
      usuario: this.state.user,
      password: this.state.pass
    })
      .then((res) => {
        // console.log('DATA', res.data);

        if (res.status === 204) {
          toast.error('Usuario o contraseña incorrectos');
          this.setState({
            isLoading: false
          })
        } else {
          var resUsuario = res.data.usuario
          if (resUsuario !== undefined) {
            if (resUsuario === this.state.user && this.state.pass.length > 0) {
              sessionStorage.setItem("idobra", res.data.id_ficha)
              // sessionStorage.setItem("codigoObra", "");

              sessionStorage.setItem("cargo", res.data.nombre_cargo);
              sessionStorage.setItem("nombre", res.data.nombre_usuario);
              sessionStorage.setItem("idacceso", res.data.id_acceso);
              sessionStorage.setItem("usuario", res.data.usuario);
              sessionStorage.setItem("imgUsuario", `${UrlServer}${res.data.imagen}`);

              // setTimeout(()=>{ 	

              window.location.href = '/inicio'

              // },10);

            } else {
              toast.error('Usuario o contraseña incorrectos');
              this.setState({
                // Loginsms: 'Usuario o contraseña incorrectos',
                // alert: 'alert text-danger',
                isLoading: false
              })
            }
          }
        }
      })
      .catch((error) => {
        toast.error('Usuario o contraseña incorrectos');
        this.setState({
          // Loginsms: 'Usuario o contraseña incorrectos',
          // alert: 'alert alert-danger alert-dismissible fade show text-danger',
          isLoading: false
        })
        // console.log('tu error ',error);
      });


  }
  render() {
    const enabled = this.state.user.length > 0 && this.state.pass.length > 0;
    const { isLoading } = this.state;
    return (
      <div className="container mt-2">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <div className="row mr-1 mb-3">
          <div className="col-sm-8">
            <div className="h4">SISTEMA DE INFORMACÍON GERENCIAL DE OBRAS</div>
          </div>
          <div className="col-sm-4">
            <div className="float-right"> 

              <Button id="contactos" outline color="warning" className="mr-2">Contacténos <TiArrowSortedDown /></Button>
              <UncontrolledPopover placement="bottom" target="contactos">
                <PopoverHeader>Contácto</PopoverHeader>
                <PopoverBody>
                  <p>
                    <b>Celular N° : </b><br /><span>951396279</span>
                  </p>
                  <p>
                   <b>Email :</b><br /> <span> sigobras.sac@gmail.com</span>
                  </p>
                  
                </PopoverBody>
              </UncontrolledPopover>

              {/* ================================= */}

              <Button id="login" outline color="primary">Ingresar <TiArrowSortedDown /></Button>

              <UncontrolledPopover placement="bottom" target="login">
                <PopoverHeader>Inicie sesión </PopoverHeader>
                <PopoverBody>
                  <form onSubmit={this.handleSubmit} autoComplete="off" >
                    <div className="form-group">
                      <input type="text" className="form-control" name="user" placeholder="Usuario" onChange={this.handleChange} required autoFocus />
                    </div>
                    <div className="form-group">
                      <input type="password" className="form-control" name="pass" placeholder="Contraseña" required onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                      <div className={this.state.alert}>{this.state.Loginsms}</div>

                      <button type="submit" disabled={!enabled}  className="btn btn-primary btn-lg btn-block">{isLoading ? <Spinner color="warnnig" type="grow" /> : 'INGRESAR'}</button>
                    </div>
                  </form>
                </PopoverBody>
              </UncontrolledPopover>
            </div>
          </div>
        </div>

        <div className="row mr-1">
          <div className="col-sm-12">
            <div style={{ position: "absolute", zIndex: 10, marginTop: "2%" }}>
              <img src={LogoSigobras} alt="login sigobras " width="80px" />
            </div>
            <Slider />
          </div>
        </div>
        <div className="row mr-1">
          <div className="col-sm-4">
            <div className="contentLemas">
              <label><b>¿QUIENES SOMOS?</b></label>
              <div>
                <p>
                  Somos SIGOBRAS, uma empresa dedicada al desarrollo de tecnologia para el manejo eficiente de procesos físicos, gerenciales,
                  financieros y documentarios.
                  </p>
                <p>
                  La innovación es otro de los ejes centrales de SIGOBRAS.
                  </p>

              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="contentLemas">
              <label><b>MISIÓN</b></label>
              <div>
                Ayudar a las entidades a gestionar todos sus recursos y evitarles pérdidas económicas en 
                el procesos constructivo
              </div>

            </div>
          </div>

          <div className="col-sm-4">
            <div className="contentLemas">
              <label><b>VISIÓN</b></label>
              <div>
                 Ser la mejor empresa del Perú en desarrollo de software utilizando inteligencia artificial aplicado a obras.
                  {/* Utilizando y aplicando los más altos estándares de calidad y confidencialidad.                 */}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Login;

