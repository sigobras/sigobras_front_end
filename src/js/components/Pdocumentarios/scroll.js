import React, { Component } from 'react'

class Layout extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
      items: 100,
      loadingState: false
    };
  }

  componentDidMount() {
    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20){
        this.loadMoreItems();
      }
    });
  }

  displayItems() {
    var items = [];
    for (var i = 0; i < this.state.items; i++) {
      items.push(<li key={i}>Sigobras {i}</li>);
    }
    console.log(" for ", items)
    return items;
  }

  loadMoreItems() {
	 if(this.state.loadingState){
		 return;
	 }
    this.setState({ loadingState: true });
    setTimeout(() => {
      this.setState({ 
        items: this.state.items + 50, 
        loadingState: false });
    }, 1000);
  }

  render() {
    return (
      <div ref="iScroll" style={{ height: "450px", overflow: "auto" }}>
        <ul>
          {this.displayItems()}
        </ul>

        {this.state.loadingState ? <p className="loading"> Cargando... </p> : ""}

      </div>
    );
  }
}


export default Layout