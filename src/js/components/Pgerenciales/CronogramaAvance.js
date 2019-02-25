import React, { Component } from 'react';


import HigtChart from './HigtChart'

class CronogramaAvance extends Component{
	constructor(){
		super();
		//this.Salir = this.Salir.bind(this);
	}
	
  render(){
    // if(sessionStorage.getItem("idacceso") === '1' ){

      return(
        <div className="card p-2">
          
            <div className="card">
                <div className="card-header">
                    Cronograma de avance                    
                </div>
                <div className="card-body">
                <HigtChart />
                </div>

            </div>
          
        </div>
      )
    // }else{
    //   return <Redirect to='/' />;
    // }
    
  }
};    

export default CronogramaAvance;