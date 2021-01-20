import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { MdPhotoLibrary } from "react-icons/md";
import CarouselImagenesObra from "./CarouselImagenesObra";
export default ({ id_ficha, codigo }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="Imagenes"
        onClick={toggle}
      >
        <MdPhotoLibrary />
      </button>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          <div style={{ display: "flex" }}>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink>Imagenes de obras</NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <CarouselImagenesObra id_ficha={id_ficha} codigoObra={codigo} />
        </ModalBody>
      </Modal>
    </div>
  );
};
