const titulos = [
  { 'nombre': "PROVINCIAS", 'value': 'provincias', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "COORDINADORES 1ra", 'value': 'coordinadores_1ra', 'readOnly': false, 'minWidth': 180, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "COORDINADORES 2da", 'value': 'coordinadores_2da', 'readOnly': false, 'minWidth': 180, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "COORDINADORES 3ra", 'value': 'coordinadores_3ra', 'readOnly': false, 'minWidth': 180, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CUI", 'value': 'cui', 'readOnly': false, 'minWidth': 80, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "NOMBRE DEL PROYECTO", 'value': 'nombre_proyecto', 'readOnly': false, 'minWidth': 700, 'type': 'textarea', 'format': 'normal', 'multiline' : true},
  { 'nombre': "SECTOR", 'value': 'sector', 'readOnly': false, 'minWidth': 120, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "NOMBRE", 'value': 'nombre', 'readOnly': false, 'minWidth': 300, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "PROFESION", 'value': 'profesion', 'readOnly': false, 'minWidth': 120, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "FECHA DE ASIGNACION", 'value': 'fecha_asignacion', 'readOnly': false, 'minWidth': 80, 'type': 'date', 'format': 'normal', 'multiline' : false},
  { 'nombre': "DNI", 'value': 'dni', 'readOnly': false, 'minWidth': 80, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CELULAR", 'value': 'celular', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CORREO", 'value': 'correo', 'readOnly': false, 'minWidth': 200, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CONDICION", 'value': 'condicion', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "NOMBRE_1", 'value': 'nombre_1', 'readOnly': false, 'minWidth': 300, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "DNI_1", 'value': 'dni_1', 'readOnly': false, 'minWidth': 80, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CELULAR_1", 'value': 'celular_1', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CORREO_1", 'value': 'correo_1', 'readOnly': false, 'minWidth': 200, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CONDICION_1", 'value': 'condicion_1', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "NOMBRE_2", 'value': 'nombre_2', 'readOnly': false, 'minWidth': 300, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CELULAR_2", 'value': 'celular_2', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "NOMBRE_3", 'value': 'nombre_3', 'readOnly': false, 'minWidth': 300, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CELULAR_3", 'value': 'celular_3', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "EXPEDIENTE", 'value': 'expediente', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "PRESUPUESTO TOTAL", 'value': 'presupuesto_total', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "ACUMUADO EJECUTADO (DEVENGADO ACUMULADO)", 'value': 'acumulado_ejecutado', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "PIA 2023", 'value': 'pia_2023', 'readOnly': false, 'minWidth': 110, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "PIA", 'value': 'pia', 'readOnly': true, 'minWidth': 80, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "MODIF", 'value': 'modif', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "PIM", 'value': 'pim', 'readOnly': false, 'minWidth': 120, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "TOTAL CERTIFICADO", 'value': 'total_certificado', 'readOnly': false, 'minWidth': 120, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "SALDO", 'value': 'saldo', 'readOnly': true, 'minWidth': 120, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "EXPEDIENTE", 'value': 'expediente_1', 'readOnly': true, 'minWidth': 120, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "AVANCE FISICO 1", 'value': 'avance_fisico_1', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'porcentaje', 'multiline' : false},
  { 'nombre': "AVANCE FINANCIERO 1", 'value': 'avance_financiero_1', 'readOnly': false, 'minWidth': 60, 'type': 'text', 'format': 'porcentaje', 'multiline' : false},
  { 'nombre': "AVANCE FISICO 2", 'value': 'avance_fisico_2', 'readOnly': false, 'minWidth': 60, 'type': 'text', 'format': 'porcentaje', 'multiline' : false},
  { 'nombre': "AVANCE FINANCIERO 2", 'value': 'avance_financiero_2', 'readOnly': false, 'minWidth': 60, 'type': 'text', 'format': 'porcentaje', 'multiline' : false},
  { 'nombre': "PLAZO DE EJECUCION", 'value': 'plazo_ejecucion', 'readOnly': false, 'minWidth': 100, 'type': 'date', 'format': 'normal', 'multiline' : false},
  { 'nombre': "FECHA DE REINICIO DE OBRA", 'value': 'fecha_reinicio_obra', 'readOnly': false, 'minWidth': 150, 'type': 'date', 'format': 'normal', 'multiline' : false},
  { 'nombre': "AMPLIACIONES DE PLAZO TRAMITADAS", 'value': 'ampliaciones_plazo_tramitadas', 'readOnly': false, 'minWidth': 400, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "FECHA CULMINACION NUEVO", 'value': 'fecha_culminacion_nuevo', 'readOnly': false, 'minWidth': 100, 'type': 'date', 'format': 'normal', 'multiline' : false},
  { 'nombre': "OBSERVACIONES", 'value': 'observaciones_fecha_control_plazos', 'readOnly': false, 'minWidth': 250, 'type': 'text', 'format': 'normal', 'multiline' : true},
  { 'nombre': "DOCUMENTACION DE REINICIO DE OBRA", 'value': 'documentacion_reinicio_obra', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "INFORME DE CORTE RESIDENTE SALIENTE", 'value': 'informe_corte_residente_saliente', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "INFORME DE CORTE RESIDENTE ENTRANTE", 'value': 'informe_corte_residente_entrante', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "ASIGNACION PRESUPUESTAL (CUADRO NECESIDADES)", 'value': 'asignacion_presupuestal', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "MODIFICACION ANALITICO", 'value': 'modificacion_analitico', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "MODIFICACION EXPEDIENTE TECNICO", 'value': 'modificacion_expediente_tecnico', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "AMPLIACION PRESUPUESTAL", 'value': 'ampliacion_presupuestal', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "PRESENTACION TAREOS", 'value': 'presentacion_tareos', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "INFORME MENSUAL", 'value': 'informe_mensual', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "MONTO PROCESO SELECCION SOLES", 'value': 'monto_proceso_seleccion_soles', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "PROCESO DE SELECCIÓN CONVOCADOS ULTIMAHOR", 'value': 'proceso_seleccion_convocados_ultimahor', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "MONTO ADQUISICION DIRECTA SOLES", 'value': 'monto_adquisicion_directa_soles', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "MONTO TOTAL SOLES", 'value': 'monto_total_soles', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "CONFORMIDAD BIENES", 'value': 'conformidad_bienes', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "CONFORMIDAD SERVICIO", 'value': 'conformidad_servicio', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "SEGUIMIENTO DE LAS OBRAS 27/02/2023", 'value': 'seguimiento_obras_2023_02_27', 'readOnly': false, 'minWidth': 700, 'type': 'textarea', 'format': 'normal', 'multiline' : true},
  { 'nombre': "SEGUIMIENTO DE LAS OBRAS 06/03/2023", 'value': 'seguimiento_obras_2023_03_06', 'readOnly': false, 'minWidth': 700, 'type': 'textarea', 'format': 'normal', 'multiline' : true},
  { 'nombre': "SEGUIMIENTO DE LAS OBRAS 13/03/2023", 'value': 'seguimiento_obras_2023_03_13', 'readOnly': false, 'minWidth': 700, 'type': 'textarea', 'format': 'normal', 'multiline' : true},
  { 'nombre': "EXPLICAR PROBLEMÁTICA PORQUE NO REINICIA LA OBRA Y PORQUE NO HIZO REQUERIMIENTOS", 'value': 'problematica_reinicio_obra', 'readOnly': false, 'minWidth': 600, 'type': 'text', 'format': 'normal', 'multiline' : true},
  { 'nombre': "CEMENTO", 'value': 'cemento', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CANTIDAD CEMENTO", 'value': 'cantidad_cemento', 'readOnly': false, 'minWidth': 80, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "FECHA VENCIMIENTO", 'value': 'fecha_vencimiento_cemento', 'readOnly': false, 'minWidth': 80, 'type': 'date', 'format': 'normal', 'multiline' : false},
  { 'nombre': "CANTIDAD VENCIDOS", 'value': 'cantidad_vencidos_cemento', 'readOnly': false, 'minWidth': 80, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "PRESTAMO N", 'value': 'prestamo', 'readOnly': false, 'minWidth': 80, 'type': 'date', 'format': 'normal', 'multiline' : false},
  { 'nombre': "TOTAL CEMENTO", 'value': 'total_cemento', 'readOnly': true, 'minWidth': 80, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "OBSERVACIONES", 'value': 'observaciones', 'readOnly': false, 'minWidth': 150, 'type': 'text', 'format': 'normal', 'multiline' : true},
  { 'nombre': "ESTADO", 'value': 'estado', 'readOnly': false, 'minWidth': 200, 'type': 'text', 'format': 'normal', 'multiline' : false},
  { 'nombre': "LINEA DE BASE – EJECUCIÓN FISICA – ACTUAL (ENERO 2)", 'value': 'expediente_2', 'readOnly': true, 'minWidth': 150, 'type': 'text', 'format': 'money', 'multiline' : false},
  { 'nombre': "AVANCE FISICO %", 'value': 'avance_fisico_porcentaje', 'readOnly': false, 'minWidth': 100, 'type': 'text', 'format': 'porcentaje', 'multiline' : false},
  { 'nombre': "RESTRICCIONES PARA NO LLEGAR AL 100%", 'value': 'restricciones_para_no_llegar_al_100', 'readOnly': false, 'minWidth': 700, 'type': 'textarea', 'format': 'normal', 'multiline' : true},
];

const estructuraTitulos = {
  nivel_1: [
    { 'nombre': "N°", colspan: 1, rowspan: 2, 'minWidth': 40 },
    { 'nombre': "PROVINCIAS", colspan: 1, rowspan: 2, 'minWidth': 150 },
    { 'nombre': "COORDINADOR 1", colspan: 1, rowspan: 2, 'minWidth': 180 },
    { 'nombre': "COORDINADOR 2", colspan: 1, rowspan: 2, 'minWidth': 180 },
    { 'nombre': "COORDINADOR 3", colspan: 1, rowspan: 2, 'minWidth': 180 },
    { 'nombre': "CUI", colspan: 1, rowspan: 2, 'minWidth': 80 },
    { 'nombre': "NOMBRE DEL PROYECTO", colspan: 1, rowspan: 2, 'minWidth': 500 },
    { 'nombre': "SECTOR", colspan: 1, rowspan: 2, 'minWidth': 200 },
    { 'nombre': "RESIDENTES 2023", colspan: 7, rowspan: 1, 'minWidth': 200 },
    { 'nombre': "SUPERVISOR 2023", colspan: 5, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "RESIDENTES 2022", colspan: 2, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "SUPERVISOR 2022", colspan: 2, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "INFORMACION PRESUPUESTAL", colspan: 9, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "CONTROL DE PLAZOS", colspan: 10, rowspan: 1, 'minWidth': 500 },
    { 'nombre': "TRAMITE DOCUMENTARIO", colspan: 9, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "REQUERIMIENTOS Y CONFORMIDADES", colspan: 6, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "SEGUIMIENTO Y MONITOREO", colspan: 4, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "MATERIALES EN CANCHA", colspan: 7, rowspan: 1, 'minWidth': 80 },
    { 'nombre': "ESTADO", colspan: 1, rowspan: 2, 'minWidth': 200 },
    { 'nombre': "LINEA DE BASE – EJECUCIÓN FISICA – ENERO 2023", colspan: 1, rowspan: 2, 'minWidth': 150 },
    { 'nombre': "META DE AVANCE FISICO AL 2023 %", colspan: 2, rowspan: 1, 'minWidth': 80 },
  ],
  nivel_2: [
    { 'nombre': "NOMBRE", 'minWidth': 300 },
    { 'nombre': "PROFESION", 'minWidth': 120 },
    { 'nombre': "FECHA DE ASIGNACION", 'minWidth': 80 },
    { 'nombre': "DNI", 'minWidth': 80 },
    { 'nombre': "CELULAR", 'minWidth': 100 },
    { 'nombre': "CORREO", 'minWidth': 200 },
    { 'nombre': "CONDICION", 'minWidth': 100 },
    { 'nombre': "NOMBRE", 'minWidth': 300 },
    { 'nombre': "DNI", 'minWidth': 80 },
    { 'nombre': "CELULAR", 'minWidth': 100 },
    { 'nombre': "CORREO", 'minWidth': 200 },
    { 'nombre': "CONDICION", 'minWidth': 100 },
    { 'nombre': "NOMBRE", 'minWidth': 300 },
    { 'nombre': "CELULAR", 'minWidth': 100 },
    { 'nombre': "NOMBRE", 'minWidth': 300 },
    { 'nombre': "CELULAR", 'minWidth': 100 },
    { 'nombre': "EXPEDIENTE INICIAL", 'minWidth': 150 },
    { 'nombre': "PRESUPUESTO TOTAL", 'minWidth': 150 },
    { 'nombre': "DEVENGADO ACUMULADO", 'minWidth': 150 },
    { 'nombre': "PIA 2023", 'minWidth': 110 },
    { 'nombre': "ESTADO DE PIA", 'minWidth': 80 },
    { 'nombre': "MODIF", 'minWidth': 100 },
    { 'nombre': "PIM", 'minWidth': 120 },
    { 'nombre': "TOTAL CERTIFICADO", 'minWidth': 120 },
    { 'nombre': "SALDO", 'minWidth': 120 },
    { 'nombre': "EXPEDIENTE", 'minWidth': 120 },
    { 'nombre': "AVANCE FISICO DIC 2022", 'minWidth': 80 },
    { 'nombre': "AVANCE FINANC. DIC 2022", 'minWidth': 80 },
    { 'nombre': "AVANCE FISICO ACTUAL", 'minWidth': 80 },
    { 'nombre': "AVANCE FINANC. ACTUAL", 'minWidth': 80 },
    { 'nombre': "PLAZO DE EJECUCION APROBADO", 'minWidth': 100 },
    { 'nombre': "FECHA DE REINICIO DE OBRA", 'minWidth': 150 },
    { 'nombre': "AMPLIACIONES DE PLAZO TRAMITADAS", 'minWidth': 100 },
    { 'nombre': "FECHA CULMINACION NUEVO", 'minWidth': 100 },
    { 'nombre': "OBSERVACIONES", 'minWidth': 400 },
    { 'nombre': "DOCUMENTACION DE REINICIO DE OBRA", 'minWidth': 150 },
    { 'nombre': "INFORME DE CORTE RESIDENTE SALIENTE", 'minWidth': 150 },
    { 'nombre': "INFORME DE CORTE RESIDENTE ENTRANTE", 'minWidth': 150 },
    { 'nombre': "ASIGNACION PRESUPUESTAL (CUADRO NECESIDADES)", 'minWidth': 150 },
    { 'nombre': "MODIFICACION ANALITICO", 'minWidth': 150 },
    { 'nombre': "MODIFICACION EXPEDIENTE TECNICO", 'minWidth': 150 },
    { 'nombre': "AMPLIACION PRESUPUESTAL", 'minWidth': 150 },
    { 'nombre': "PRESENTACION TAREOS", 'minWidth': 150 },
    { 'nombre': "INFORME MENSUAL", 'minWidth': 150 },
    { 'nombre': "MONTO PROCESO SELECCION SOLES", 'minWidth': 150 },
    { 'nombre': "PROCESOS DE SELECCIÓN", 'minWidth': 150 },
    { 'nombre': "MONTO ADQUISICION DIRECTA SOLES", 'minWidth': 150 },
    { 'nombre': "MONTO TOTAL A DEVENGAR", 'minWidth': 150 },
    { 'nombre': "N° DE CONFORMIDAD BIENES", 'minWidth': 60 },
    { 'nombre': "N° DE CONFORMIDAD SERVICIOS", 'minWidth': 60 },
    { 'nombre': "SEGUIMIENTO DE LAS OBRAS 27/02/2023", 'minWidth': 300 },
    { 'nombre': "SEGUIMIENTO DE LAS OBRAS 06/03/2023", 'minWidth': 300 },
    { 'nombre': "SEGUIMIENTO DE LAS OBRAS 13/03/2023", 'minWidth': 300 },
    { 'nombre': "PROBLEMÁTICA (REINICIO, REQUERIMIENTOS, CONFORMIDADES, ETC)", 'minWidth': 300 },
    { 'nombre': "CEMENTO", 'minWidth': 100 },
    { 'nombre': "CANTIDAD CEMENTO", 'minWidth': 80 },
    { 'nombre': "FECHA VENCIMIENTO", 'minWidth': 80 },
    { 'nombre': "CANTIDAD VENCIDOS", 'minWidth': 80 },
    { 'nombre': "FECHA VENCIMIENTO_1", 'minWidth': 80 },
    { 'nombre': "TOTAL CEMENTO", 'minWidth': 80 },
    { 'nombre': "OBSERVACIONES", 'minWidth': 400 },
    { 'nombre': "AVANCE FISICO %", 'minWidth': 100 },
    { 'nombre': "RESTRICCIONES PARA NO LLEGAR A LA META DEL AVANCE FISICO 2023", 'minWidth': 400 },
  ]
}


export { titulos, estructuraTitulos }

