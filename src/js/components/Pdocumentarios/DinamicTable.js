import React, { Component } from 'react';

class DinamicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { 'id': 1, 1: '', 2: 'Class1', 3: 'Class2', 4: 'Class3', 5: 'Class4', 6: 'Class5', 7: 'Class6' },
        { 'id': 2, 1: 'MONDAY', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5', 7: '6' },
        { 'id': 3, 1: 'TUESDAY', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5', 7: '6' },
        { 'id': 4, 1: 'WEDNESDAY', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5', 7: '6' },
        { 'id': 5, 1: 'THURSDAY', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5', 7: '6' },
        { 'id': 6, 1: 'FRIDAY', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5', 7: '6' }
      ],
      stateCopy:[],
      errorInput: '',
      editar:"",
    };
     this.editColumn = this.editColumn.bind(this);
     this.inputeable = this.inputeable.bind(this);
  }


  // edit Column  
  editColumn(p, k, e) {
    let inputValue = e.target.innerText;
    let obj = p.p;
    let objId = obj.id;
    let position = k.k;
    let values = Object.values(obj);
    
    if (values.indexOf(inputValue) == -1) {
      
      obj[position] = inputValue;

      let stateCopy = this.state.data;
      stateCopy.map((object, index) => {
        if (object.id == objId) {
          object = obj[position];
        }
      })
      this.setState(stateCopy);
      this.setState({ errorInput: '' });
      console.log('stateCopystateCopy ', stateCopy);
    } else {
      this.setState({ errorInput: 'This period is also available in your list' });
      return false;
    }
  }

  inputeable(e){
    console.log("hola ", e.target)

    this.setState({ editar: e.target.innerText})

  }

  render() {

    let list = this.state.data.map(p => {
      return (
        <tr key={p.id}>
          {
            Object.keys(p).filter(k => k !== 'id').map(k => {
              return (
                <td key={p.id + '' + k}>
                  <div suppressContentEditableWarning="true" contentEditable="true" value={k} onInput={this.editColumn.bind(this, { p }, { k })}> 
                    {p[k]}
                  </div>
                </td>
              );
            })
          }
        </tr>
      );
    });
    return (
      <div className="card">
        <table className="table table-sm">
          <tbody>{list}</tbody>
        </table>
        <hr />
        <div suppressContentEditableWarning="true" contentEditable="true" onInput={this.inputeable} >hola</div>
        <h1> 
          {
            this.state.editar
          }
        </h1>
      </div>


    );
  }
}
export default DinamicTable