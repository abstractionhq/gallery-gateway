import React from "react";
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container
} from "reactstrap";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import FaExclamationTriangle from "@fortawesome/fontawesome-free-solid/faExclamationTriangle";

const PieceDeleteModal = ({
  isOpen,
  picture,
  closeDeleteModal,
  deletePiece,
  EntryThumb
}) => {
  const onDelete = e => deletePiece().then(() => closeDeleteModal(e));
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        Warning{" "}
        <FontAwesomeIcon
          icon={FaExclamationTriangle}
          className="align-middle"
        />
      </ModalHeader>
      <ModalBody>
        <Container>
          <Row>
            Deleting a piece is a permanent action. Are you sure you want to
            delete this piece?
          </Row>
          <Row className="justify-content-center">
            <i>{picture.title}</i>
          </Row>
          <Row className="justify-content-center">
            <EntryThumb piece={picture} type="piece" />
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeDeleteModal}>Cancel</Button>
        <Button onClick={onDelete} color="danger">
          Confirm Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PieceDeleteModal;
