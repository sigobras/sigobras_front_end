import React, { useState } from 'react';
import { Button, Spinner, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { ToastContainer, toast } from "react-toastify";
import { TiArrowSortedDown } from "react-icons/ti";
import axios from 'axios'
import Slider from "./Slider"
import { UrlServer } from '../Utils/ServerUrlConfig'
import LogoSigobras from '../../../images/sigobras-neon.jpg'
import '../../../css/login.css'
export default () => {
  const [UsuarioDatos, setUsuarioDatos] = useState(
    {
      usuario: "",
      password: ""
    }
  )
  const [isLoading, setisLoading] = useState(false)
  function handleChange(e) {
    setUsuarioDatos({
      ...UsuarioDatos,
      [e.target.name]: e.target.value
    })
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setisLoading(true)
    try {
      var res = await axios.post(UrlServer + '/login2', UsuarioDatos)
      if (res.status == 200) {
        toast.success('USUARIO CORRECTO');
        sessionStorage.setItem("idacceso", res.data.id_acceso);
        window.location.href = '/'
      } else {
        toast.error('Usuario o contraseña incorrectos');
      }

    } catch (error) {
      toast.error('Usuario o contraseña incorrectos');
    }
    setisLoading(false)
  }

  return (
    <div className="container mt-2">
      <ToastContainer
        position="top-right"
        autoClose={1000}
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
                  <b>Celular N° : </b><br /><span>951 396 279</span>
                </p>
                <p>
                  <b>Email :</b><br /> <span> manager@sigobras.com</span>
                </p>
              </PopoverBody>
            </UncontrolledPopover>
            <Button id="login" outline color="primary">Ingresar <TiArrowSortedDown /></Button>
            <UncontrolledPopover placement="bottom" target="login">
              <PopoverHeader>Acceda a SIGOBRAS </PopoverHeader>
              <PopoverBody>
                <form onSubmit={handleSubmit} autoComplete="off" >
                  <div className="form-group">
                    <input type="text" className="form-control" name="usuario" placeholder="Usuario" onChange={handleChange} required autoFocus />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" name="password" placeholder="Contraseña" required onChange={handleChange} />
                  </div>
                  <div
                    className="form-group"
                  >
                    <button
                      type="submit"
                      disabled={!(UsuarioDatos.usuario.length > 0
                        && UsuarioDatos.password.length > 0)
                      } className="btn btn-primary btn-lg btn-block"
                    >
                      {
                        isLoading
                          ?
                          <Spinner color="warnnig" type="grow" />
                          : 'INGRESAR'}
                    </button>
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
                Somos SIGOBRAS, una empresa dedicada al desarrollo de tecnologías para una gestión más óptima de la información de las obras.
                </p>
              <p>
                La innovación y la flexibilidad de interacción con nuestros clientes es un pilar clave para nosotros.
                </p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="contentLemas">
            <label><b>MISIÓN</b></label>
            <div>
              Ayudar a las entidades a gestionar sus recursos y evitarles pérdidas económicas en el proceso constructivo.
            </div>

          </div>
        </div>
        <div className="col-sm-4">
          <div className="contentLemas">
            <label><b>VISIÓN</b></label>
            <div>
              Nos orientaremos a crear un sistema INTELIGENTE utilizando tecnologías de desarrollo de vanguardia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}