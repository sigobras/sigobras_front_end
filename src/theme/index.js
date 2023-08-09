import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#17a2b8", // Cambia este valor a un tono más oscuro
    },
    secondary: {
      main: "#ffa500", // Cambia este valor a un tono más oscuro
    },
    background: {
      default: "#121212", // Cambia este valor a un tono más oscuro
      paper: "#121212", // Cambia este valor a un tono más oscuro
    },
  },
  typography: {
    fontSize: 12, // Ajusta el tamaño de fuente deseado en px
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#212121", // Cambia este valor a un tono más oscuro
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          backgroundColor: "#303030", // Cambia este valor a un tono más oscuro
        },
      },
    },
  },
});

export default theme;
