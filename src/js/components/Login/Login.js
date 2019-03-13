import React, { Component } from 'react';
import { Collapse, Button, CardHeader, CardBody, Card, Spinner } from 'reactstrap';
import { ToastContainer, toast } from "react-toastify";

import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import LogoSigobras from '../../../images/sigobras-neon.jpg'
import '../../../css/login.css'

import SubirImagen from './SubirImagen'

class Login extends Component {
  constructor(){
    super();
    this.state={
      user:'',
      pass:'',
      nombAcceso:'',
      sesionCargo:'',
      Loginsms:'',
      alert:'',
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

 }
 
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
      //  console.log(sessionStorage.getItem("api"));	
      // console.log(window.location.port)
  }

  handleSubmit(e){
    e.preventDefault();
    
      this.setState({ isLoading: true });
      axios.post(UrlServer+'/login',{
          usuario: this.state.user,
          password: this.state.pass
      })
      .then((res)=> {
        if(res.status === 204){
          toast.error('Usuario o contraseña incorrectos');
          this.setState({
            isLoading: false
          })
        }else{
          var resUsuario = res.data.usuario
          if(resUsuario !== undefined){
            if(resUsuario === this.state.user && this.state.pass.length > 0){
              sessionStorage.setItem("cargo", res.data.nombre_cargo);
              sessionStorage.setItem("nombre",  res.data.nombre_usuario);
              sessionStorage.setItem("idacceso", res.data.id_acceso);
              sessionStorage.setItem("usuario", res.data.usuario);

              setTimeout(()=>{ 	
                    
                window.location.href = '/inicio'
              
              },10);
            
            }else{
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
      .catch((error)=> {
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
            <div>
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
              {/* <SubirImagen /> */}
              <div className="container-dialog modal-login">
                  <div className="modal-content">
                    <div className="modal-headers">
                        <div className="img">
                          <img src={ LogoSigobras } className="mx-auto d-block" alt="sigoobras sac" height="75"/>
                        </div>
                        
                        <h4>Inicie sesión</h4>
                    </div>
                    <div className="modal-body">
                      <form>
                          <div className="form-group">
                              <input type="text" className="form-control" name="user" placeholder="Usuario" required="required"  onChange={this.handleChange} required autoFocus  />
                          </div>
                          <div className="form-group">
                              <input type="password" className="form-control" name="pass" placeholder="Password" required="required" onChange={this.handleChange} />
                          </div>
                          <div className="form-group">
                              <div className={this.state.alert }>{this.state.Loginsms }</div>

                              <button type="submit"  disabled={!enabled} onClick={this.handleSubmit}  className="btn btn-primary btn-lg btn-block">{isLoading ? <Spinner color="warnnig" /> : 'INGRESAR'}</button>
                          </div>
                      </form>
                    </div>
                    <div className="modal-footer p-1 text-center">
                        <label>SISTEMA DE INFORMACIÓN GERENCIAL DE OBRAS S.A.C. <br/> Ⓒ 2018 - 2019</label>
                    </div>
                  </div>
              </div>
            </div>
        );
    }
}

export default Login;

