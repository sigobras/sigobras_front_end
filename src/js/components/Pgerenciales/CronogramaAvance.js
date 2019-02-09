import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [{name: 'P1', acumulado: 2.35, programado: 2.35, ejecutado: 5},
              {name: 'P2', acumulado: 6.76, programado: 4.41, ejecutado: 0 },
              {name: 'P3', acumulado: 9.83, programado: 3.07, ejecutado: 0},
              {name: 'P4', acumulado: 15.42, programado: 5.59, ejecutado: 0},
              {name: 'P5', acumulado: 26.68, programado: 11.26, ejecutado: 0},
              {name: 'P6', acumulado: 40.02, programado: 13.34, ejecutado: 0},
              {name: 'P7', acumulado: 51.24, programado: 11.21, ejecutado: 0},
              {name: 'P8', acumulado: 59.98, programado: 8.75, ejecutado: 0},
              {name: 'P9', acumulado: 69.63, programado: 9.65, ejecutado: 0},
              {name: 'P10', acumulado: 79.9, programado: 9.86, ejecutado: 0},
              {name: 'P11', acumulado: 92.64, programado: 13.15, ejecutado: 0},
              {name: 'P12', acumulado: 97.06, programado: 4.43, ejecutado: 0},
              {name: 'P13', acumulado: 100, programado: 12.94, ejecutado: 0},
              ];



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
                    <BarChart width={900} height={500} data={data} margin={{top: 20, right: 10, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend />
                        <Bar dataKey="ejecutado" stackId="a" fill="#8884d8" />
                        <Bar dataKey="programado" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="acumulado" stackId="a" fill="#DBDBDB" />
                
                    </BarChart>
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