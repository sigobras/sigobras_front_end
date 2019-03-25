import React, { Component } from 'react';

class PracticaImg extends Component {

  render() {

    // Datos que debe renderizar la imagen

    const item = [
      {
        id: 1,
        img: 'https://i.pinimg.com/originals/21/62/7c/21627c321f7790ff26f9dd23476a826d.gif',
        class: 'img-fluid',
        alt: 'cargado de datos de algo',
        title: 'cargado de datos de algo',
        target: '_blank',
        link: 'http://sigobras.com/'
      },
      {
        id: 2,
        img: 'https://source.unsplash.com/random',
        class: 'img-fluid',
        alt: 'cargado de datos de algo',
        title: 'cargado de datos de algo',
        target: '_blank',
        link: 'http://sigobras.com/'
      }
    ];

    return (

      item.map(item => { 
        return <a key={ item.id } href={ item.link } target={ item.target }>
                <img className={ item.class } src={ item.img } alt={ item.alt } title={ item.title } width="250px" />
               </a>

      })

    )
    

  }

};

export default PracticaImg;