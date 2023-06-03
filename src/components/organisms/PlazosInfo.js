import { Typography } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import React from 'react';
import { fechaFormatoClasico } from '../../js/components/Utils/Funciones';
const PlazosInfo = ({ item }) => {
    const theme = useTheme();
    const useStyles = makeStyles(() => ({
      container: {
        display: "flex",
        alignItems: "center",
        margin: 0,
        padding: 0,
      },
      button: {
        borderRadius: "13px",
        padding: "0 10px",
        lineHeight: "22px!important",
        margin: "5px",
        cursor: "default",
        margin: 0,
        padding: 0,
      },
      label: {
        color: theme.palette.primary.main,
        marginRight: "5px",
        fontSize: "12px",
      },
      text: {
        fontSize: "14px",
      },
    }));
    const classes = useStyles();
  
    return (
      <div className={classes.container}>
        {item.plazoinicial_fecha && (
          <>
            <Typography className={classes.label}>Inicio de obra</Typography>
            <Typography className={classes.text}>
              {fechaFormatoClasico(item.plazoinicial_fecha)}
            </Typography>
          </>
        )}
        {!item.plazoaprobado_ultimo_fecha &&
          !item.plazosinaprobar_ultimo_fecha && (
            <>
              <Typography className={classes.label}>
                Fecha de culminación
              </Typography>
              <Typography className={classes.text}>
                {fechaFormatoClasico(item.plazoinicial_fechafinal)}
              </Typography>
            </>
          )}
        {item.plazoaprobado_ultimo_fecha && (
          <>
            <Typography className={classes.label}>
              Ultimo plazo aprovado
            </Typography>
            <Typography className={classes.text}>
              {fechaFormatoClasico(item.plazoaprobado_ultimo_fecha)}
            </Typography>
          </>
        )}
        {item.plazosinaprobar_ultimo_fecha && (
          <>
            <Typography className={classes.label}>
              Ultimo plazo por aprovado
            </Typography>
            <Typography className={classes.text}>
              {fechaFormatoClasico(item.plazosinaprobar_ultimo_fecha)}
            </Typography>
          </>
        )}
      </div>
    );
  };
  export default PlazosInfo