import Modal from "react-bootstrap/Modal";

interface Props {
  onClose: () => void;
  info: ModalInfo;
}

export interface ModalInfo {
  title: string;
  body: string;
}

const MessageModal = ({ onClose, info }: Props) => {
  return (
    <div>
      <Modal show={true} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{info.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{info.body}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default MessageModal;
