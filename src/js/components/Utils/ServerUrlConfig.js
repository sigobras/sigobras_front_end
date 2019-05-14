// const axios = require('axios')

const UrlServer = "http://190.117.94.80:9000";
const Id_Acceso = sessionStorage.getItem("idacceso")
const ImgAccesoSS = sessionStorage.getItem("imgUsuario")

const Id_Obra = sessionStorage.getItem("idobra")


// const Token = axios.defaults.headers.common['Authorization'] = `bearer ${sessionStorage.getItem('TuToken')}`;


module.exports = {
    UrlServer,
    Id_Acceso,
    Id_Obra,
    ImgAccesoSS
    // Token
} 

