import React, { useState } from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { TiArrowSortedDown } from "react-icons/ti";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { UrlServer } from "../../utils/ServerUrlConfig";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/auth';
const LoginComponent = () => {

    
  const [UsuarioDatos, setUsuarioDatos] = useState({
    usuario: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  function handleChange(e) {
    setUsuarioDatos({
      ...UsuarioDatos,
      [e.target.name]: e.target.value,
    });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "login-popover" : undefined;
  const dispatch = useDispatch();
  async function handleSubmit(e) {
    e.preventDefault();
    setisLoading(true);
    try {
      var res = await axios.post(UrlServer + "/login2", UsuarioDatos);
      toast.success("USUARIO CORRECTO", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      Cookies.set("authToken", res.data.id_acceso);
      sessionStorage.setItem("idacceso", res.data.id_acceso);
      dispatch(login());
      router.push("/inicio");
    } catch (error) {
      console.log({ error });
      toast.error("USUARIO O PASSWORD INCORRECTOS", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    setisLoading(false);
    handleClose();
  }

  return (
    <div>
     <Button 
        id="contact-us-button"
        variant="outlined"
        color="primary"
        aria-describedby={id}
        onClick={handleClick}
        endIcon={<TiArrowSortedDown />}
      >
        Ingresar
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2}>
          <Typography variant="subtitle1" align="center">
            Acceda a SIGOBRAS{" "}
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              label="Usuario"
              name="usuario"
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contraseña"
              type="password"
              name="password"
              required
              onChange={handleChange}
              size="small"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !(
                  UsuarioDatos.usuario.length > 0 &&
                  UsuarioDatos.password.length > 0
                )
              }
              size="small"
              sx={{ mt: 2 }} 
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "INGRESAR"
              )}
            </Button>
          </form>
        </Box>
      </Popover>
    </div>
  );
};

export default LoginComponent;
