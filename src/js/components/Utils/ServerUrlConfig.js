// const axios = require('axios')

// const UrlServer = "http://190.117.94.80:9002";
const UrlServer = "http://190.117.94.80:9000";
const Id_Acceso = sessionStorage.getItem("idacceso")
const ImgAccesoSS = sessionStorage.getItem("imgUsuario")
const CargoAccesoSS = sessionStorage.getItem("cargo")

const Id_Obra = sessionStorage.getItem("idobra")
const NombUsuarioSS = sessionStorage.getItem("nombre")


// const Token = axios.defaults.headers.common['Authorization'] = `bearer ${sessionStorage.getItem('TuToken')}`;


module.exports = {
    UrlServer,
    
    Id_Acceso,
    ImgAccesoSS,
    CargoAccesoSS,
    
    Id_Obra,
    NombUsuarioSS,

    
    
    // Token
} 

