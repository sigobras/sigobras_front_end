import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  Button,
  Spinner,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { TiArrowSortedDown } from "react-icons/ti";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";

import Slider from "./Slider";
import { UrlServer } from "../Utils/ServerUrlConfig";
import LogoSigobras from "../../../images/sigobras-neon.jpg";
//publico
const ResumenObras = lazy(() => import("./ResumenObras"));

import "../../../css/login.css";
export default () => {
  const [UsuarioDatos, setUsuarioDatos] = useState({
    usuario: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);
  function handleChange(e) {
    setUsuarioDatos({
      ...UsuarioDatos,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setisLoading(true);
    try {
      var res = await axios.post(UrlServer + "/login2", UsuarioDatos);
      // var res = await axios.post(UrlServer + "/v1/accesos/login", UsuarioDatos);
      console.log("res", res);
      if (res.status == 200) {
        toast.success("USUARIO CORRECTO");
        sessionStorage.setItem("idacceso", res.data.id_acceso);
        window.location.href = "/";
      } else {
        toast.error("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      toast.error("Usuario o contraseña incorrectos");
    }
    setisLoading(false);
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg  bg-dark">
        <a className="navbar-brand" href="/">
          <img src={LogoSigobras} alt="login sigobras " width="50px" />
          <span className="textSigobras h5 ml-2">SIGOBRAS</span>
        </a>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link to="/ResumenObras" className="nav-link">
              {" "}
              Resumen Obras
            </Link>
          </li>
        </ul>
        <ul className="nav navbar-nav flex-row justify-content-between ml-auto">
          <li>
            <Button id="contactos" outline color="warning" className="mr-2">
              Contacténos <TiArrowSortedDown />
            </Button>
            <UncontrolledPopover placement="bottom" target="contactos">
              <PopoverHeader>Contácto</PopoverHeader>
              <PopoverBody>
                <p>
                  <b>Celular N° : </b>
                  <br />
                  <span>951 396 279</span>
                </p>
                <p>
                  <b>Email :</b>
                  <br /> <span> manager@sigobras.com</span>
                </p>
              </PopoverBody>
            </UncontrolledPopover>
          </li>
          <li>
            <Button id="login" outline color="primary">
              Ingresar <TiArrowSortedDown />
            </Button>
            <UncontrolledPopover placement="bottom" target="login">
              <PopoverHeader>Acceda a SIGOBRAS </PopoverHeader>
              <PopoverBody>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="usuario"
                      placeholder="Usuario"
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Contraseña"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      disabled={
                        !(
                          UsuarioDatos.usuario.length > 0 &&
                          UsuarioDatos.password.length > 0
                        )
                      }
                      className="btn btn-primary btn-lg btn-block"
                    >
                      {isLoading ? (
                        <Spinner color="warnnig" type="grow" />
                      ) : (
                        "INGRESAR"
                      )}
                    </button>
                  </div>
                </form>
              </PopoverBody>
            </UncontrolledPopover>
          </li>
        </ul>
      </nav>

      <div className="container-fluid">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/ResumenObras">
              <ResumenObras />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
};
function Home() {
  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div style={{ position: "absolute", zIndex: 10, marginTop: "2%" }}>
            {/* <img src={LogoSigobras} alt="login sigobras " width="80px" /> */}
          </div>
          <Slider />
        </div>
      </div>
      <div className="row mr-1">
        <div className="col-sm-4">
          <div className="contentLemas">
            <label>
              <b>¿QUIENES SOMOS?</b>
            </label>
            <div>
              <p>
                Somos SIGOBRAS, una empresa dedicada al desarrollo de
                tecnologías para una gestión más óptima de la información de las
                obras.
              </p>
              <p>
                La innovación y la flexibilidad de interacción con nuestros
                clientes es un pilar clave para nosotros.
              </p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="contentLemas">
            <label>
              <b>MISIÓN</b>
            </label>
            <div>
              Ayudar a las entidades a gestionar sus recursos y evitarles
              pérdidas económicas en el proceso constructivo.
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="contentLemas">
            <label>
              <b>VISIÓN</b>
            </label>
            <div>
              Nos orientaremos a crear un sistema INTELIGENTE utilizando
              tecnologías de desarrollo de vanguardia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
