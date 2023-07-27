
import { useLocation } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect, useRef } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Transitions from './Transition'
import { motion } from 'framer-motion';
import stylesTrain from './TrainButtons.module.css';
import Button from 'react-bootstrap/Button';
import Card  from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrainPage from './TrainPage';
import Table from 'react-bootstrap/Table';

const EvaluatePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const modelNames = params.get('models');
  const trainedModelInfo = location.state?.trainedModelInfo || [];
  const navigate = useNavigate();
  const [selectedModels, setSelectedModels] = useState({});
  const [evaluationResults, setEvaluationResults] = useState([]);




  const removeTrainFromModelName = (modelName) => {
    if (modelName.includes("Train")) {
      return modelName.replace("Train", "").trim();
    } else {
      return modelName;
    }
  };
  
  const handleCheckboxChange = (modelName) => {
    setSelectedModels((prevSelected) => ({
      ...prevSelected,
      [modelName]: !prevSelected[modelName],
    }));
  };

  const handleEvaluateModels = async () => {
    const selectedModelNames = Object.keys(selectedModels).filter(
      (modelName) => selectedModels[modelName]
    );
  
    if (selectedModelNames.length === 0) {
      console.log('No models selected for evaluation.');
      return;
    }
  
    const evaluationResultsArray = [];
  
    for (const modelName of selectedModelNames) {
      const testModelName = modelName.replace('Train', 'Test');
  
      const csvFileName = trainedModelInfo.find((info) => info[0] === modelName)?.[1];
      const targetVariable = trainedModelInfo.find((info) => info[0] === modelName)?.[2];
  
      if (!csvFileName || !targetVariable) {
        console.log(`CSV file or target variable not found for model: ${modelName}`);
        continue;
      }
  
      try {
        const response = await axios.post('http://localhost:3333/testModels', {
          models: testModelName,
          csvFileNames: [csvFileName],
          yVariable: [targetVariable],
        });
  
        const evaluationScores = response.data;
        const { r2error, rmse } = evaluationScores[testModelName];
  
        evaluationResultsArray.push({
          modelName,
          r2error: parseFloat(r2error),
          rmse: parseFloat(rmse),
        });
      } catch (error) {
        console.error(`Error during evaluation for model ${modelName}:`, error);
        evaluationResultsArray.push({
          modelName,
          r2error: 'Error',
          rmse: 'Error',
        });
      }
    }
  
    setEvaluationResults(evaluationResultsArray);
  };
  
  
  
  

  // Function to handle clicking the model name in the list group
  const handleModelClick = (modelName) => {
    setSelectedModels((prevSelected) => ({
      ...prevSelected,
      [modelName]: !prevSelected[modelName],
    }));
  };

  return (
    <Transitions>
    <header >
    <Navbar bg="warning" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="#home">
        <img
            alt=""
            src="https://www.startupsg.gov.sg/api/v0/profile-images/2447/image/avatar"
            width="75"
            height="75"
            className="d-inline-block align-center"
          />{' '}Oak Consulting</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/" >Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
          <Nav.Link  as={Link} to="/TrainPage">Train</Nav.Link>
          <Nav.Link as={Link} to="/TestPage">Test</Nav.Link>
          <Nav.Link aas={Link} to="/ExecutePage">Predict</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
  <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '50px' }}>
        <Container  style={{ marginLeft: '350px' }}>
          <h1 className="mb-4">Trained Models</h1>
          {trainedModelInfo.length > 0 ? (
            <div>
              <ListGroup>
                {trainedModelInfo.map(([modelName, csvFilename, selectedYVariable], index) => (
                  <ListGroup horizontal key={index} className="mb-2">
                    <ListGroup.Item
                      variant="success"
                      style={{ width: '400px'}}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedModels[modelName] ? 'active' : ''}`}
                      onClick={() => handleModelClick(modelName)}
                    >
                      {removeTrainFromModelName(modelName)}
                      <Form.Check
                        type="checkbox"
                        className="ms-3 "
                        variant="success"
                        checked={selectedModels[modelName] || false}
                        onChange={() => handleCheckboxChange(modelName)}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item variant="info" style={{ width: '200px', wordWrap: 'break-word' }}>CSV File: {csvFilename}</ListGroup.Item>
                    <ListGroup.Item variant="secondary"style={{ width: '200px', wordWrap: 'break-word'  }}>Target Variable: {selectedYVariable}</ListGroup.Item>
                  </ListGroup>
                ))}
              </ListGroup>
              <Button className="mt-3" variant="primary" block onClick={handleEvaluateModels}>
                Evaluate Selected Models
              </Button>
            </div>
          ) : (
            <div>No trained models found.</div>
          )}
          <div className='mt-3' >
            <Button variant='danger' onClick={() => navigate('/TrainPage')}>
              Back to Train Page
            </Button>
          </div>


        </Container>
      </div >
      <Container style={{ width: '60%', alignContent: 'center', marginTop:'20px', marginBottom:'50px'}}>

          <h2 className="text-center">Model Evaluation Results</h2>
            <Table striped bordered hover responsive size="lg">
              <thead>
                <tr>
                <th style={{ width: '150px' }}>Model Name</th>
                <th style={{ width: '150px' }}>R-squared Score</th>
                <th style={{ width: '150px' }}>Root Mean Squared Error</th>
                </tr>
              </thead>
              <tbody>
              {evaluationResults.map((result, index) => (
                  <tr key={index}>
                    <td style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.modelName}
                    </td>
                    <td style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.r2error}
                    </td>
                    <td style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.rmse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
      </Container>
    </Transitions>
  );
};

export default EvaluatePage;