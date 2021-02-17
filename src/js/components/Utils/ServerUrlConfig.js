// para desarrollo con el backend local
// const UrlServer = "http://localhost:9000";
// //para git pull cambiar a este modo
// const UrlServer = "http://api.sigobras.com";
const UrlServer = "https://api.sigobras.com";
const Id_Acceso = sessionStorage.getItem("idacceso");
module.exports = {
  UrlServer,
};
