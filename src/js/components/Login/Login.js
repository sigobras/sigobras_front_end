import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { ToastContainer, toast } from "react-toastify";

import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import LogoSigobras from '../../../images/logoSigobras.png'
import '../../../css/login.css'

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

  }

  handleSubmit(e){
    e.preventDefault();
    
      this.setState({ isLoading: true });
      axios.post(UrlServer+'/login',{
          usuario: this.state.user,
          password: this.state.pass
      })
      .then((res)=> {
          // console.log('lñlñ', res.data)
          var resUsuario = res.data.usuario
        if(resUsuario !== undefined){
          if(resUsuario === this.state.user && this.state.pass.length > 0){
            sessionStorage.setItem("cargo", res.data.nombre_cargo);
            sessionStorage.setItem("nombre",  res.data.nombre_usuario);
            sessionStorage.setItem("idacceso", res.data.id_acceso);

            setTimeout(()=>{ 	
                  
              window.location.href = '/inicio'
            
            },50);
          
          }else{
            toast.error('Usuario o contraseña incorrectos');
            this.setState({
              // Loginsms: 'Usuario o contraseña incorrectos',
              // alert: 'alert text-danger',
              isLoading: false
            })
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

              <div className="container-dialog modal-login shadow">
                  <div className="modal-content">
                    <div className="modal-header">
                        <div className="avatar">
                            <img src={ LogoSigobras } className="pt-2" alt="sigoobras sac" height="75"/>
                        </div>
                        <h4 className="text-dark">Inicie sesión</h4>
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

                              <button type="submit"  disabled={!enabled} onClick={this.handleSubmit}  className="btn btn-primary btn-lg btn-block">{isLoading ? 'Cargando...' : 'INGRESAR'}</button>
                          </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                        <a href="#">SISTEMA DE INFORMACIÓN GERENCIAL DE OBRAS S.A.C. <br/> Ⓒ 2018 - 2019</a>
                    </div>
                  </div>
              </div>
            </div>
        );
    }
}

export default Login;


class Example extends Component {
  constructor(props) {
    super(props);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);

    this.state = { 
        collapse: false, 
        status: 'cerrado' 
    };
  }

  onEntering() {
    this.setState({ status: 'abriendo...' });
  }

  onEntered() {
    this.setState({ status: 'abierto' });
  }

  onExiting() {
    this.setState({ status: 'cerrando...' });
  }

  onExited() {
    this.setState({ status: 'cerrado' });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }  
  
  toggle1() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Toggle</Button>
        <h5>Current state: {this.state.status}</h5>
        
        <Collapse
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <Card>
            <CardBody>
              Anim pariatur cliche reprehenderit,
             enim eiusmod high life accusamus terry richardson ad squid. Nihil
             anim keffiyeh helvetica, craft beer labore wes anderson cred
             nesciunt sapiente ea proident.
            </CardBody>
          </Card>
        </Collapse>
            <hr/>


        <Button color="primary" onClick={this.toggle1} style={{ marginBottom: '1rem' }}>Toggle1</Button>
        <h5>Current state: {this.state.status}</h5>
        <Collapse
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <Card>
            <CardBody>
              Anim pariatur cliche reprehenderit,
             enim eiusmod high life accusamus terry richardson ad squid. Nihil
             anim keffiyeh helvetica, craft beer labore wes anderson cred
             nesciunt sapiente ea proident.
            </CardBody>
          </Card>
        </Collapse>
        
      </div>
    );
  }
}
