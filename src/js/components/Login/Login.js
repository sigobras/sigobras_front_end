import React, { Component } from 'react';
import { Collapse, Button, CardHeader, CardBody, Card, Spinner } from 'reactstrap';
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

                              <button type="submit"  disabled={!enabled} onClick={this.handleSubmit}  className="btn btn-primary btn-lg btn-block">{isLoading ? <Spinner color="warnnig" /> : 'INGRESAR'}</button>
                          </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                        <label>SISTEMA DE INFORMACIÓN GERENCIAL DE OBRAS S.A.C. <br/> Ⓒ 2018 - 2019</label>
                    </div>
                  </div>
              </div>
              {/* <Apps/> */}
            </div>
        );
    }
}

export default Login;



class Apps extends Component {
  constructor() {
      super();
      this.toggle = this.toggle.bind(this);
      this.state = { 
        collapse: 0, 
        cards: [1, 2, 3, 4, 5] 
      };
    }

    toggle(e) {
      let event = e.target.dataset.event;
      console.log('icon', event)
      this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
    }

    render() {
      const {cards, collapse} = this.state;
      return (
        <div className="container">
            <h3 className="page-header">Reactstrap Accordion using card component</h3>
            {cards.map(index => 
                <Card style={{ marginBottom: '1rem' }} key={index}>
                  <CardHeader onClick={this.toggle} data-event={index}> Header {collapse === index?'➖':'➕'}</CardHeader>
                  <Collapse isOpen={collapse === index}>
                  <CardBody>
                      Anim pariatur cliche reprehenderit,
                      enim eiusmod high life accusamus terry richardson ad squid. Nihil
                      anim keffiyeh helvetica, craft beer labore wes anderson cred
                      nesciunt sapiente ea proident.
                  </CardBody>
                  </Collapse>
                </Card>
              
            )}     
            
          </div>
      );
    }
}
