import React, { useState } from "react";
import Slider from "react-slick";

import styles from "./home.module.css";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Card,
  Typography,
  Container,
  Grid,
} from "@mui/material";

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container sx={{ marginTop: 10, padding: "2rem" }}>
        <Box sx={{ marginBottom: "2rem" }}>
          <Slider {...sliderSettings}>
            <div>
              <img
                src="/images/carousel-image-1.jpg"
                alt="Carousel Image 1"
                style={{ width: "100%" }}
                className={styles.sliderImage}
              />
            </div>
            <div>
              <img
                src="/images/carousel-image-2.jpg"
                alt="Carousel Image 2"
                style={{ width: "100%" }}
                className={styles.sliderImage}
              />
            </div>
            <div>
              <img
                src="/images/carousel-image-3.jpg"
                alt="Carousel Image 3"
                style={{ width: "100%" }}
                className={styles.sliderImage}
              />
            </div>
          </Slider>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <Typography variant="h6" component="div" gutterBottom>
                <b>¿QUIENES SOMOS?</b>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Somos SIGOBRAS, una empresa dedicada al desarrollo de
                tecnologías para una gestión más óptima de la información de las
                obras. La innovación y la flexibilidad de interacción con
                nuestros clientes es un pilar clave para nosotros.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Typography variant="h6" component="div" gutterBottom>
                <b>MISIÓN</b>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ayudar a las entidades a gestionar sus recursos y evitarles
                pérdidas económicas en el proceso constructivo.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Typography variant="h6" component="div" gutterBottom>
                <b>VISIÓN</b>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Nos orientaremos a crear un sistema INTELIGENTE utilizando
                tecnologías de desarrollo de vanguardia.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
