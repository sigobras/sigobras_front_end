import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

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
  this.setState({ isLoading: true });
    axios.post(UrlServer+'/login',{
          usuario: this.state.user,
          password: this.state.pass
      })
      .then((response)=> {
      console.log(response.data[0])

    if(response.data[0].nombre_usuario){
      sessionStorage.setItem("cargo", response.data[0].nombre_cargo);
      sessionStorage.setItem("nombre", response.data[0].nombre_usuario);
      sessionStorage.setItem("idacceso", response.data[0].id_acceso);			
      setTimeout(()=>{ 	
            
        window.location.href = '/inicio'
      
      },200);
    
      // axios.get(UrlServer+'/menus/'+sessionStorage.getItem("idacceso"))
      // .then((response)=> {
      //   // console.log(response.data)
  
      //   if(response.data.length){
      //     var menupos0 = JSON.stringify(response.data[0]);

      //     sessionStorage.setItem("menus_id_ficha", menupos0);
      //     sessionStorage.setItem("menusPrivilegios", JSON.stringify(response.data));
          
  
      //     setTimeout(()=>{ 	
            
      //       window.location.href = '/inicio'
          
      //     },200);
      //   }
            
      // })
      // .catch((error)=> {
      //   console.log(error);
      // });
    }else{
      this.setState({
        Loginsms: 'Usuario o contraseña incorrectos',
        alert: 'alert text-danger',
        isLoading: false
      })
    }
          
      })
      .catch((error)=> {
        console.log(error);
      });
  
    //  {sessionStorage.getItem("nombre")}	
    //  {sessionStorage.getItem("cargo")}	
    //  {sessionStorage.getItem("idacceso")}
    // {sessionStorage.getItem("misobras")};
    // {sessionStorage.getItem("idobra")};
    // {sessionStorage.getItem("menus_id_ficha")};
    // {sessionStorage.getItem("id_usuario")};
  //   consumo de axios login 
    
  e.preventDefault();
  }
    render() {
      const enabled =
          this.state.user.length > 0 &&
		  this.state.pass.length > 0;
		  const { isLoading } = this.state;
        return (
            <div>

              <div className="modal-dialog modal-login shadow">
                  <div className="modal-content">
                      <div className="modal-header">
                          <div className="avatar">
                              <img src={ LogoSigobras } className="pt-2" alt="sigoobras sac" height="75"/>
                          </div>
                          <h4 className="text-dark">Inice sesión</h4>
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
                          <a href="#">SISTEMA DE INFORMACIÓN GERENCIAL DE OBRAS S.A.C. Ⓒ 2018 - 2019</a>
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
