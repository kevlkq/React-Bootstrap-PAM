import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatasetPreview from './DatasetPreview';

const DatasetPreviewModal = ({ show, handleClose, data }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Dataset Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DatasetPreview data={data} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DatasetPreviewModal;