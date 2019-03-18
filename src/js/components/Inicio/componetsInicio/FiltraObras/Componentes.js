import React, { Component } from 'react';

class Componentes extends Component {
  constructor(props){
    super(props)
    this.state = {
      DataComponente:this.props.DataComponente
    }
  }


  render() {
    return (
      <div>
        { console.log('componentes' , this.props.DataComponente) }
        <table className="table table-bordered table-sm bg-dark">
          <thead>
            <tr>
                <th>#</th>
                <th>COMPONENTE</th>
                <th>PRESUPUESTO BASE</th>
                <th>EJECUCIÓN FÍSICA</th>
                <th>BARRRA PORCENTUAL</th>
            </tr>
          </thead>
          <tbody>
            { this.props.DataComponente.length <= 0 ? <tbody><tr><td>cargando</td></tr></tbody> :  
            
              this.props.DataComponente.map((ObrasComp, IndexObrasComp)=>

              <tr key={ IndexObrasComp } >
                <td>{ ObrasComp.numero }</td>
                <td>{ ObrasComp.nombre }</td>
                <td> S/. { ObrasComp.presupuesto }</td>
                <td> S/. { ObrasComp.comp_avance }</td>
                <td>
                
                <div style={{
                        width: '100%',
                        height: '20px',
                        textAlign: 'center'
                    }}
                >

                    <div style={{
                        height: '5px',
                        backgroundColor: '#c3bbbb',
                        borderRadius: '2px',
                        position: 'relative'
                        }}
                    >
                    <div
                        style={{
                        width: `${ObrasComp.porcentaje_avance_componentes}%`,
                        height: '100%',
                        backgroundColor: ObrasComp.porcentaje_avance_componentes > 95 ? 'rgb(164, 251, 1)'
                            : ObrasComp.porcentaje_avance_componentes > 50 ? '#ffbf00'
                            :  '#ff2e00',
                        borderRadius: '2px',
                        transition: 'all .9s ease-in',
                        position: 'absolute',
                        boxShadow: `0 0 6px 1px ${ObrasComp.porcentaje_avance_componentes > 95 ? 'rgb(164, 251, 1)'
                            : ObrasComp.porcentaje_avance_componentes > 50 ? '#ffbf00'
                            :  '#ff2e00'}`
                        }}
                    /><span style={{ position:'inherit', fontSize:'0.6rem', top: '4px' }}>{ObrasComp.porcentaje_avance_componentes} %</span>
                    </div>
                
                </div> 
                </td>
              </tr>

            )}

            {/* <tr>
              <td colSpan="2">TOTAL </td>
              <td> S/. { Obras.g_total_presu }</td>
              <td> S/. { Obras.presu_avance }</td>
              <td>

                    <div style={{
                        width: '100%',
                        height: '20px',
                        textAlign: 'center'
                      }}
                    >

                        <div style={{
                            height: '8px',
                            backgroundColor: '#c3bbbb',
                            borderRadius: '2px',
                            position: 'relative'
                            }}
                        >
                        <div
                            style={{
                            width: `${Obras.porcentaje_avance}%`,
                            height: '100%',
                            backgroundColor: Obras.porcentaje_avance > 95 ? 'rgb(164, 251, 1)'
                                : Obras.porcentaje_avance > 50 ? '#ffbf00'
                                :  '#ff2e00',
                            borderRadius: '2px',
                            transition: 'all .9s ease-in',
                            position: 'absolute',
                            boxShadow: `0 0 6px 1px ${Obras.porcentaje_avance > 95 ? 'rgb(164, 251, 1)'
                                : Obras.porcentaje_avance > 50 ? '#ffbf00'
                                :  '#ff2e00'}`
                            }}
                        /><span style={{ position:'inherit', fontSize:'0.6rem', top: '4px' }}>{Obras.porcentaje_avance} %</span>
                        </div>
                    
                    </div> 
                    
                </td>
          </tr> */}

        </tbody> 
      </table>
      </div>
    );
  }
}

export default Componentes;