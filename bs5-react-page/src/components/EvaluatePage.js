import React, { useState, useEffect } from 'react';
import stylesTrain from './TrainButtons.module.css';
import { useLocation } from 'react-router-dom';
import TrainedList from './TrainedList';
import CsvHeadersModal from './CsvHeadersModal';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const EvaluatePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const modelNames = params.get('models');
  const trainedModelInfo = location.state?.trainedModelInfo || [];

  // State to hold the selected models using their names as keys
  const [selectedModels, setSelectedModels] = useState({});

  // Function to handle checkbox changes and update selected models
  const handleCheckboxChange = (modelName) => {
    setSelectedModels((prevSelected) => ({
      ...prevSelected,
      [modelName]: !prevSelected[modelName],
    }));
  };

  // Function to handle clicking the model name in the list group
  const handleModelClick = (modelName) => {
    setSelectedModels((prevSelected) => ({
      ...prevSelected,
      [modelName]: !prevSelected[modelName],
    }));
  };

  return (
    <div className="d-flex justify-content-start align-items-center min-vh-100">
      <Container className="w-25" >
        <h1 className="mb-4">Trained Models</h1>
        {trainedModelInfo.length > 0 ? (
          <div>
            <ListGroup>
              {trainedModelInfo.map(([modelName, csvFilename], index) => (
                <ListGroup horizontal>
                <ListGroup.Item variant="success"
                  key={modelName}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedModels[modelName] ? 'active' : ''}`}
                  onClick={() => handleModelClick(modelName)}
                >
                  {modelName}
                  <Form.Check
                    type="checkbox"
                    className="ms-3"
                    variant="success"
                    checked={selectedModels[modelName] || false}
                    onChange={() => handleCheckboxChange(modelName)}
                  />
                </ListGroup.Item>
                <ListGroup.Item>CSV File: {csvFilename}</ListGroup.Item>
                </ListGroup>
              ))}
            </ListGroup>
            {/* <ListGroup>
              {trainedModelInfo.map(([modelName, csvFilename], index) => (
                <ListGroup.Item variant="info" key={index}>
                  {modelName} - Finished
                  <div>
                    CSV File: {csvFilename}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup> */}
            <Button className="mt-3" variant="primary" block>
              Evaluate Selected Models
            </Button>
          </div>
        ) : (
          <div>No trained models found.</div>
        )}
      </Container>
    </div>
  );
};

export default EvaluatePage;
