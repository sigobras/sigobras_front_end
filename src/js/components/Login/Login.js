import React, { useState, Suspense, lazy, Fragment } from "react";
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
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Slider from "./Slider";
import { UrlServer } from "../Utils/ServerUrlConfig";
import LogoSigobras from "../../../../public/images/sigobras-neon.jpg";
import "react-toastify/dist/ReactToastify.min.css";

const ResumenObras = lazy(() => import("./ResumenObras"));

const Navbar = ({ isLoading, handleChange, handleSubmit, UsuarioDatos }) => (
  <Fragment>
    <ToastContainer />
    <nav className="navbar navbar-dark bg-dark p-2">
      <a className="navbar-brand" href="/">
        <img src={LogoSigobras} alt="login sigobras " width="50px" />
        <span className="textSigobras h5 ml-2">SIGOBRAS</span>
      </a>
      <ul className="nav navbar-nav flex-row justify-content-between ml-auto">
        <li style={{ paddingRight: "5px" }}>
          <Button id="contactos" outline color="warning" className="mr-2">
            Contacténos <TiArrowSortedDown />
          </Button>
          <ContactPopover />
        </li>
        <li style={{ paddingRight: "5px" }}>
          <Button id="login" outline color="primary">
            Ingresar <TiArrowSortedDown />
          </Button>
          <LoginPopover
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            UsuarioDatos={UsuarioDatos}
            isLoading={isLoading}
          />
        </li>
      </ul>
    </nav>
  </Fragment>
);

const ContactPopover = () => (
  <UncontrolledPopover placement="bottom" target="contactos">
    <PopoverHeader>Contácto</PopoverHeader>
    <PopoverBody>
      <p>
        <b>Celular N° : </b>
        <span>951 396 279</span>
      </p>
      <p>
        <b>Email :</b>
        <span> manager@sigobras.com</span>
      </p>
    </PopoverBody>
  </UncontrolledPopover>
);

const LoginPopover = ({
  handleChange,
  handleSubmit,
  UsuarioDatos,
  isLoading,
}) => (
  <UncontrolledPopover placement="bottom" target="login">
    <PopoverHeader>Acceda a SIGOBRAS </PopoverHeader>
    <PopoverBody>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <input
            type="text"
            className="form-control mb-2"
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
            className="form-control mb-2"
            name="password"
            placeholder="Contraseña"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button
            type="submit"
            disabled={!UsuarioDatos.usuario || !UsuarioDatos.password}
            className="btn btn-primary btn-block"
          >
            {isLoading ? <Spinner color="warnnig" type="grow" /> : "INGRESAR"}
          </button>
        </div>
      </form>
    </PopoverBody>
  </UncontrolledPopover>
);

export default function App() {
  const [UsuarioDatos, setUsuarioDatos] = useState({
    usuario: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioDatos((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    try {
      const res = await axios.post(`${UrlServer}/login2`, UsuarioDatos);
      toast.success("USUARIO CORRECTO", toastConfig("top-right"));
      sessionStorage.setItem("idacceso", res.data.id_acceso);
      window.location.href = "/";
    } catch (error) {
      toast.error("USUARIO O PASSWORD INCORRECTOS", toastConfig("top-right"));
    }

    setisLoading(false);
  };

  const toastConfig = (position) => ({
    position,
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });

  return (
    <Router>
      <Navbar
        isLoading={isLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        UsuarioDatos={UsuarioDatos}
      />
      <div className="container-fluid">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ResumenObras" element={<ResumenObras />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <Fragment>
      <Slider />
      <div className="row justify-content-around m-2">
        <InfoBox title="¿QUIENES SOMOS?" content={aboutUsContent} />
        <InfoBox title="MISIÓN" content={missionContent} />
        <InfoBox title="VISIÓN" content={visionContent} />
      </div>
    </Fragment>
  );
}

const aboutUsContent = (
  <Fragment>
    <p>
      Somos SIGOBRAS, una empresa dedicada al desarrollo de tecnologías para una
      gestión más óptima de la información de las obras.
    </p>
    <p>
      La innovación y la flexibilidad de interacción con nuestros clientes es un
      pilar clave para nosotros.
    </p>
  </Fragment>
);

const missionContent =
  "Ayudar a las entidades a gestionar sus recursos y evitarles pérdidas económicas en el proceso constructivo.";

const visionContent =
  "Nos orientaremos a crear un sistema INTELIGENTE utilizando tecnologías de desarrollo de vanguardia.";

const InfoBox = ({ title, content }) => (
  <div className=" p-4 text-center" style={{border:'1px solid white',borderRadius:10 ,width:'30%'}}>
    <div className="contentLemas">
      <label>
        <b>{title}</b>
      </label>
      <div>{content}</div>
    </div>
  </div>
);
