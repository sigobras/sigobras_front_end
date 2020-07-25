// redondea a dos decimales
function Redondea(x) {
    // console.log("x =>>", x)
    if (x==null) {
        return "-"
    }
    else if(x==0 || isNaN(x)){
        return "-"
    }
    return Number.parseFloat(x).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    
}
function Redondea1(x) {
    // console.log("x =>>", x)
    return Number(Number.parseFloat(x).toFixed(2));
}


function Redondea2(x) {
    // console.log("x =>>", x)
    return Number.parseFloat(x).toFixed(2);
}
// CALCULA LA FECHA ACTUAL
function FechaActual(){
    var fecha = new Date();
    
    var anio = fecha.getFullYear();
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate();
    
    if(dia < 10){
        dia = "0" + dia
    }
    if(mes < 10){
        mes = "0" + mes
    }

    return anio+ '-'+ mes +'-'+  dia
}

// CALCULA EL PRIMER DIA DEL MES ACTUAL
function PrimerDiaDelMesActual(){
    var date = new Date();
    var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    primerDia = primerDia.getDate()
        
    var ano = date.getFullYear();
    var mesAct = date.getMonth()+1;
    
    if(primerDia < 10){
        primerDia = "0" + primerDia;
    }
    
    if(mesAct < 10){
        mesAct = `0${mesAct}` 
    }

    return  ano + '-'+mesAct +'-'+ primerDia
}

// convierte formato dinero a numero
function ConvertFormatStringNumber(datoString){
    // console.log('datoString', datoString)

    if(datoString !== ""  && datoString !==  NaN && datoString !== undefined && typeof datoString !== "number"){
        return Number(datoString.replace(/[^0-9\.-]+/g,""));
    }else{
        return datoString
    }
}

// CAMBIAR FORMATO FECHA QUE VBIENE 2019-02-21 A feb. 2019
function convertirFechaLetra(fecha){
    if(fecha !== ""){

        var fechaLlega = new Date( fecha )

        var anio = fechaLlega.getFullYear()
        var mes =  (fechaLlega.getMonth() + 1)
        var dia =  fechaLlega.getDate()
        if(mes <=9){
          mes = "0"+mes
        }

        if(dia <=9){
            dia = "0"+dia
          }

        var formatearFecha =  anio+'-'+mes+'-'+dia

        // console.log("formatearFecha segun quiero", formatearFecha)

        const config = { year: 'numeric', month: 'short'};

        var fechaLetra = new Date( formatearFecha ).toLocaleDateString('ES', config)

        // console.log('fecha que llega', fecha )
        // console.log("fecha mess letra>>>", fechaLetra)
        return fechaLetra
    }
    
}


// genera colores aleatorios

function GeraColoresRandom() {

    function populate(a) {
      
      var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
      for ( var i = 0; i < 6; i++ ) {
        var x = Math.round( Math.random() * 14 );
        var y = hexValues[x];
        a += y;
      }
      return a;
    }
    
    var newColor1 = populate('#');
    var newColor2 = populate('#');
    var angle = Math.round( Math.random() * 360 );
    
    return "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
    
}
  
// encuentrar la extension de un archivo

function Extension(nombreArchivo) {
    // console.log("archivo", nombreArchivo)   
    if(nombreArchivo){
        var resultado = nombreArchivo.slice((nombreArchivo.lastIndexOf(".") - 1 >>> 0) + 2);
        // console.log("result>>>>>>>>>> ", `.${resultado}`)
        return `.${resultado.toLowerCase()}`
    }
     return ""
   
}

var diasdelasemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo" ]
var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio","agosto","septiembre","octubre","noviembre","diciembre" ]

function Money_to_float(money) {
    money = '' + money
    money = money.replace(/,/g, "")
    money = parseFloat(money) || 0
    return money 
}


module.exports = {
    Redondea,
    PrimerDiaDelMesActual,
    FechaActual,
    ConvertFormatStringNumber,
    convertirFechaLetra,

    GeraColoresRandom,

    Extension,
Redondea1,
diasdelasemana,
Redondea2,
Money_to_float
    
} 