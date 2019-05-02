import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

class Example extends Component {
  constructor (props) {
    super(props);

    this.state = { 
        cSelected: [],
        tasks: ['task1', 'task2', 'task3', 'task4', 'task5', 'task6'], 
    };
    

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    //this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);

  }

  onRadioBtnClick(rSelected,array) {
    
    this.setState({ tasks:array, });
    console.log('aslgo', array)
    
    this.setState({ rSelected });
  }


//   onCheckboxBtnClick(selected) {
//     const index = this.state.cSelected.indexOf(selected);
//     if (index < 0) {
//       this.state.cSelected.push(selected);
//     } else {
//       this.state.cSelected.splice(index, 1);
//     }
//     this.setState({ cSelected: [...this.state.cSelected] });
//   }



  render() {
    const { tasks} = this.state;

    return (        
      <div>
          {/* <ul>
            {tasks}
          </ul> */}
        <h5>Radio Buttons</h5>
        <ButtonGroup>
        

        {

            tasks.map((task,Pp)=>
          <Button color="primary" key={ Pp } onClick={() => this.onRadioBtnClick(task.array)} >{task.array}</Button>
            )
        }
        
          {/* <Button color="primary" onClick={() => this.onRadioBtnClick(2)} >Two</Button>
          <Button color="primary" onClick={() => this.onRadioBtnClick(3)} >Three</Button> */}
          </ButtonGroup>
        <p>Selected: {this.state.rSelected}</p>

        {/* <h5>Checkbox Buttons</h5>
        <ButtonGroup>
          <Button color="primary" onClick={() => this.onCheckboxBtnClick(1)} active={this.state.cSelected.includes(1)}>One</Button>
          <Button color="primary" onClick={() => this.onCheckboxBtnClick(2)} active={this.state.cSelected.includes(2)}>Two</Button>
          <Button color="primary" onClick={() => this.onCheckboxBtnClick(3)} active={this.state.cSelected.includes(3)}>Three</Button>
        </ButtonGroup>
        <p>Selected: {JSON.stringify(this.state.cSelected)}</p> */}
      </div>
    );
  }
}

export default Example;