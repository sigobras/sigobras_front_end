import React, { Component } from 'react';
import { Card , CardHeader, CardBody, Nav,  NavItem, NavLink, Collapse, CardImg, CardText, CardTitle, CardDeck, CardSubtitle, Button } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios'
import { MdImage, MdBrokenImage } from "react-icons/md";
import { UrlServer } from '../../Utils/ServerUrlConfig'
import Gallery from 'react-grid-gallery';



class HistorialImagenesObra extends Component {
  constructor() {
    super();

    this.state = {
      DataComponentesApi:[],
      DataPartidasApi:[],
      DataImagenesApi:[],
      activeTab: '0',
      // capturamos el nombre del componete
      nombreComponente:'',
    };
    this.TabsComponentes = this.TabsComponentes.bind(this);
    this.CollapseItem = this.CollapseItem.bind(this);

  }

  componentWillMount(){
    axios.post(`${UrlServer}/getImagenesComponentes`,
      {
        "id_ficha":sessionStorage.getItem("idobra")
      }
    )
    .then((res)=>{
      console.log("res componentes imagenes", res.data)
      this.setState({
        DataComponentesApi:res.data,
        DataPartidasApi:res.data[0].partidas,
        nombreComponente:res.data[0].nombre

      })
    })
    .catch((err)=>{
      console.error("error al tratar de llamar al api" ,err)
    })
  }

  TabsComponentes(tab, nombreComponente) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        nombreComponente
      });
    }
  }

  CollapseItem(valor){
    let event = valor  
    this.setState({ 
      collapse: this.state.collapse === Number(event) ? -1 : Number(event),
    })

    // consumir el api de immagenes

    axios.post(`${UrlServer}/getImagenesPorObra`,
      {
        "id_ficha":sessionStorage.getItem("idobra")
      }
    )
    .then((res)=>{
      // console.log("res actividades imagenes", res.data)
      var DataQueLLega = res.data
      var dataAgrupar = []
      DataQueLLega.forEach(img => {
        dataAgrupar.push(
          {
              src: UrlServer+img.imagen,
              thumbnail: UrlServer+img.imagen,
              tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
              caption: "sigobras.com"
          }
        )
      });
      // console.log('data>', dataAgrupar)
      this.setState({
        DataImagenesApi:dataAgrupar
      })
    })
    .catch((err)=>{
      console.error("error al tratar de llamar al api" ,err)
    })
    
  }

  render() {
    const { DataComponentesApi, nombreComponente, DataPartidasApi, DataImagenesApi, collapse } = this.state

    return (
      <div>
        <Card>
          <Nav tabs>
            {
              DataComponentesApi.map((Comp, IC)=>
                <NavItem key={ IC}>
                  <NavLink className={classnames({ active: this.state.activeTab === IC.toString() })} onClick={() => { this.TabsComponentes(IC.toString(), Comp.nombre) }}>
                    C- { Comp.numero }
                  </NavLink>
                </NavItem>
              )
              
            }
              
          </Nav>

        <Card className="m-1">
          <CardHeader>
            { nombreComponente }
          </CardHeader>
          <CardBody>
            <table className="table table-sm ">
              <thead >
                <tr>
                  <th>ITEM</th>
                  <th>DESCRICION</th>
                  <th>CANT IMG</th>
                  <th>AVANCE</th>
                  <th></th>

                </tr>
              </thead>
              {
                DataPartidasApi.map((partida, IP)=>
                  <tbody key={ IP }>
                    <tr className={ partida.tipo === "titulo" ? "font-weight-bold":  collapse === IP? "font-weight-light resplandPartida icoVer": "font-weight-light icoVer" }>
                      <td className={ partida.tipo === "titulo" ? '': collapse === IP? "tdData1": "tdData"} onClick={partida.tipo === "titulo" ? ()=> this.CollapseItem(-1, -1 ): ()=> this.CollapseItem(IP, partida.id_partida )} data-event={IP} >{ partida.item }</td>
                      <td>{ partida.descripcion }</td>
                      <td>{ partida.numero_imagenes }</td>
                      <td>{ partida.porcentaje_avance }</td>
                      <td>
                        <div className="aprecerIcon">
                          <MdImage />
                          <MdBrokenImage />
                        </div>
                      </td>
                      
                    </tr>
                    <tr className={ collapse === IP? "resplandPartidabottom": "d-none"  }>
                      <td colSpan="5">
                        <Collapse isOpen={collapse === IP}>
                          <Gallery images={DataImagenesApi}/>
                        </Collapse>
                      </td>
                    </tr>
                  </tbody>
                )
              }
                
            </table>
          </CardBody>
        </Card>
        </Card>
      </div>
    );
  }
}

export default HistorialImagenesObra;