import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Provider, useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { UrlServer } from "../js/components/Utils/ServerUrlConfig";
import Layout from "../components/organisms/Layout";
import withAuth from "../hoc/withAuth";
import store from "../redux/store";

axios.defaults.baseURL = UrlServer;

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ThemeProvider>
  );
}
export default withAuth(MyApp);
