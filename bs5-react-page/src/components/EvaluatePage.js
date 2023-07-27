
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


const EvaluatePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const modelNames = params.get('models');
  const trainedModelInfo = location.state?.trainedModelInfo || [];
  const navigate = useNavigate();
  const [selectedModels, setSelectedModels] = useState({});

  const handleCheckboxChange = (modelName) => {
    setSelectedModels((prevSelected) => ({
      ...prevSelected,
      [modelName]: !prevSelected[modelName],
    }));
  };

  const handleEvaluateModels = () => {
    const selectedModelNames = Object.keys(selectedModels).filter(
      (modelName) => selectedModels[modelName]
    );
  
    if (selectedModelNames.length === 0) {
      console.log('No models selected for evaluation.');
      return;
    }
  
    axios
      .post('/testmodels', { models: selectedModelNames })
      .then((response) => {
        const evaluationScores = response.data;
        console.log('Evaluation scores:', evaluationScores);
      })
      .catch((error) => {
        console.error('Error during evaluation:', error);
      });
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
            <Nav.Link as={Link} to="/" >HomePage</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/TrainPage">Training Page</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/TestPage">Testing Page</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/ExecutePage">Predictions Page</NavDropdown.Item>
            </NavDropdown>
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
                      {modelName}
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
      </div>
    </Transitions>
  );
};

export default EvaluatePage;