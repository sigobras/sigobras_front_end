import React, { Component } from 'react';

class LibrarySigobras extends Component {
  constructor(){
    super()
    this.state = {
      
    }
    this.Filtrador = this.Filtrador.bind(this)
  }

  Filtrador() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }


  render() {
    return (
      <div>
          
        <input type="text" id="myInput" onKeyUp={ this.Filtrador } placeholder="busca algo" title="quieres buscar algo" />

        <table id="myTable">
          <thead>
            <tr className="header" className="table table-bordered table-sm">
              <th>nombre</th>
              <th>pais</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Berglunds snabbkop</td>
              <td>Sweden</td>
            </tr>
            <tr>
              <td>Island Trading</td>
              <td>UK</td>
            </tr>
            <tr>
              <td>Koniglich Essen</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Laughing Bacchus Winecellars</td>
              <td>Canada</td>
            </tr>
            <tr>
              <td>Magazzini Alimentari Riuniti</td>
              <td>Italy</td>
            </tr>
            <tr>
              <td>North/South</td>
              <td>UK</td>
            </tr>
            <tr>
              <td>Paris specialites</td>
              <td>France</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default LibrarySigobras;