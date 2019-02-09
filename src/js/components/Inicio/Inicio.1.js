import React,{ Component } from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import RecordObras from '../Pgerenciales/RecordObras/RecordObras';

class Inicio extends Component{
    
    render() {
        const data = [
            {
            name: 'Roy Agasthyan',
            age: 26
            },
            {
                name: 'Sam Thomason',
                age: 22
            },
            {
                name: 'Michael Jackson',
                age: 36
            },
            {
                name: 'Samuel Roy',
                age: 56
            },
            {
                name: 'Rima Soy',
                age: 12
            },
            {
                name: 'Suzi Eliamma',
                age: 58
            }
        ];

        const columns = [
            {
            Header: 'Name',
            accessor: 'name'
            },
            {
                Header: 'Age',
                accessor: 'age'
            }
        ]

        return (
            <div className="container-fluid  mt-5">
                <div className="card">
                    <div className="card-body">
                    <hr />
                    <h4 className="text-center">BIENVENIDO  AL SISTEMA DE INFORMACION GERENCIAL DE OBRAS  SIGOBRAS SAC</h4>
                    <RecordObras />
                    </div>
                </div>

                <hr/>
                <div className="card">
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize = {1}
                        pageSizeOptions = {[1,3, 6, 9, 12, 18 ]}
                    />   
                </div>
                
            </div>         
        );
    }
    
}

export default Inicio;