import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink } from 'reactstrap';
import { MdPhotoLibrary } from "react-icons/md";
import CarouselImagenesPartidas from "./CarouselImagenesPartidas";
import CarouselImagenesObra from "./CarouselImagenesObra";
import FormularioImagenObra from "./FormularioImagenObra";
import { fechaFormatoClasico } from '../../Utils/Funciones';

export default ({ id_ficha, codigo }) => {

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal)
  };

  const [CarouselSeleccionado, setCarouselSeleccionado] = useState("PARTIDA")
  const [KeyTemp, setKeyTemp] = useState("1")
  const [FechaPartida, setFechaPartida] = useState("")
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="Imagenes"
        onClick={toggle}
      ><MdPhotoLibrary />
      </button>
      <Modal isOpen={modal} toggle={toggle} size="lg" >
        <ModalHeader toggle={toggle}>
          <div style={{ display: "flex" }}>
            {/* Imagenes de {codigo} */}
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    active={CarouselSeleccionado == "PARTIDA"}
                    onClick={() => setCarouselSeleccionado("PARTIDA")}
                  >
                    Imagenes de partidas
                                    </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={CarouselSeleccionado == "OBRA"}
                    onClick={() => setCarouselSeleccionado("OBRA")}
                  >
                    Imagenes de obras
                                    </NavLink>
                </NavItem>
                {CarouselSeleccionado == "OBRA" &&
                  <NavItem>
                    <NavLink>
                      <FormularioImagenObra
                        codigoObra={codigo}
                        id_ficha={id_ficha}
                        recargar={setKeyTemp}
                      />
                    </NavLink>
                  </NavItem>}
              </Nav>

            </div>
            <div
              style={{
                right: "48px",
                position: "absolute"
              }}
            >
              {CarouselSeleccionado == "PARTIDA" &&
                fechaFormatoClasico(FechaPartida)
              }
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          {
            CarouselSeleccionado == "PARTIDA" ?
              <CarouselImagenesPartidas
                id_ficha={id_ficha}
                setFechaPartida={setFechaPartida}
              />
              :
              <CarouselImagenesObra
                id_ficha={id_ficha}
                codigoObra={codigo}
                key={KeyTemp}
              />
          }
        </ModalBody>

      </Modal>

    </div>
  )
}