import Modal from "react-bootstrap/Modal";

interface Props {
  onClose: () => void;
  toggleModal: () => void;
  errorMsg: string;
}

export default function ConfirmModal({
  toggleModal,
  onClose,
  errorMsg,
}: Props) {
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete?
        {errorMsg && (
          <p className={"text-danger mt-2 mb-0"}>
            <strong>{errorMsg}</strong>
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-danger" onClick={toggleModal}>
          Delete
        </button>
        <button className="btn btn-outline-secondary" onClick={onClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}
