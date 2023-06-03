import React, { useEffect, useState } from "react";

const ComponentTable = ({
  Componentes,
  item,
  ObraComponentesSeleccionada,
  Redondea,
}) => {
  return (
    ObraComponentesSeleccionada == item.id_ficha && (
      <TableRow>
        <TableCell colSpan={8}>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>N°</TableCell>
                  <TableCell>COMPONENTE</TableCell>
                  <TableCell>PRESUPUESTO CD</TableCell>
                  <TableCell>EJECUCIÓN FÍSICA</TableCell>
                  <TableCell>BARRRA PORCENTUAL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "#333333" }}>
                {Componentes.map((component) => (
                  <TableRow key={component.id_componente}>
                    <TableCell>{component.numero}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#8caeda">
                        {component.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {" "}
                      S/. {Redondea(component.presupuesto)}
                    </TableCell>
                    <TableCell>
                      <ComponenteAvance
                        id_componente={component.id_componente}
                      />
                    </TableCell>
                    <TableCell>
                      <ComponenteBarraPorcentaje
                        id_componente={component.id_componente}
                        componente={component}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>TOTAL COSTO DIRECTO</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#8caeda">
                      {item.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    S/.{" "}
                    {Redondea(
                      Componentes.reduce(
                        (acc, item2) => acc + item2.presupuesto,
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TableCell>
      </TableRow>
    )
  );
};

export default ComponentTable;
