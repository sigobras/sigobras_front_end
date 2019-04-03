// redondea a dos decimales
function Redondea(x) {
    return Number.parseFloat(x).toFixed(2);
}

// CALCULA LA FECHA ACTUAL
function FechaActual(){
    var fecha = new Date();
    
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate();
    
    if(dia < 10){
        dia = "0" + dia
    }
    if(mes < 10){
        mes = "0" + mes
    }

    return ano+ '-'+ mes +'-'+  dia
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

    if(datoString !== ""  && datoString !==  NaN){
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

        var fechaLetra = new Date( fecha ).toLocaleDateString('ES', config)

        // console.log('fecha que llega', fecha )
        // console.log("fecha mess letra>>>", fechaLetra)
        return fechaLetra
    }
    
}

module.exports = {
    Redondea,
    PrimerDiaDelMesActual,
    FechaActual,
    ConvertFormatStringNumber,
    convertirFechaLetra
} 