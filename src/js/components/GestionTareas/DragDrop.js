import React, { Component } from 'react';

class DragDrop extends Component {
  constructor(props) {
    super(props);
      this.state = {
        tasks: [
          {
            name: "Learn Angular",
            category: "ejecucion",
            bgcolor: "red" 
          },
          { 
            name: "React",
            category: "ejecucion", 
            bgcolor: "blue"
          },
          { 
            name: "Vue", 
            category: "ejecucion", 
            bgcolor: "yellow" 
          }
        ]
      }

      this.onDragStart =  this.onDragStart.bind(this)
      this.onDragOver =  this.onDragOver.bind(this)
      this.onDrop =  this.onDrop.bind(this)
  }
  
  onDragStart(ev, id) {
    console.log('moviendo :', id);
    ev.dataTransfer.setData("id", id);
  }

  onDragOver(ev) {
    ev.preventDefault();
  }

  onDrop(ev, cat) {
    console.log("onDrop ", cat)
    let id = ev.dataTransfer.getData("id");

    let tasks = this.state.tasks.filter((task)=> {
        if (task.name == id) {
          task.category = cat;
        }
        return task;
      });

    this.setState({
      ...this.state,
      tasks
    });
  }

  render() {
    var tasks = {
      ejecucion: [],
      completado: []
    }

    this.state.tasks.forEach((t) => {
      tasks[t.category].push(
        <div key={t.name}
          onDragStart={(e) => this.onDragStart(e, t.name)}
          draggable
          className="draggable"
          style={{ backgroundColor: t.bgcolor }}
        >
          {t.name}
        </div>
      );
    });

    return (
      <div className="container-fluid">
        <div className="row">
        
          <div className="col-6">

            <div className="card"
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => { this.onDrop(e, "ejecucion") }}>
              <span>TAREAS </span>
              {tasks.ejecucion}
            </div>

          </div>

          <div className="col-6">

            <div className="card"
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => this.onDrop(e, "completado")}>
              <span>COMPLETADAS</span>
              {tasks.completado}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default DragDrop
