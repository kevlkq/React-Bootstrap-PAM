
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card  from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {
  BrowserRouter as Router, Routes,
  Route, Link
} from "react-router-dom";
import { useLocation } from 'react-router-dom';

// import TrainPage from './components/TrainPage';
// import TestPage from './components/TestPage';
// import ExecutePage from './components/ExecutePage';
import { AnimatePresence } from 'framer-motion';
import Transitions from './Transition'



const Home = () => {
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
                <Nav.Link as={Link} to="/ExecutePage">Predict</Nav.Link>
              </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
        <Container>
        <Row className="px-4 my-5">    
          <Col sm={7}>
  
            <Image src="Images/PA.jpg" 
            fluid 
            rounded
            className=""
            />
            </Col>
          <Col sm={5}>
            <h1 class="font-weight bold" style={{ fontSize: '60px' }}>Predictive Analysis</h1>
            <p style={{ marginTop:"25px", fontSize: '18px' }}>
             Predictive analytics is the use of data, statistical algorithms and machine learning techniques to identify the likelihood of future outcomes based on historical data. The goal is to go beyond knowing what has happened to providing a best assessment of what will happen in the future.
            </p>
          </Col>
        </Row>
        <Row>
          <Card className ="text-center bg-warning text-black">
            <Card.Body>Below you can choose to Train, Test, or Predict your datasets</Card.Body>
          </Card>
        </Row>
        <div className="d-flex justify-content-center mt-5">
          <Row>
          <Col className="text-center mb-4" style={{ marginRight: '2rem' }}>
            <Card style={{ width: '23rem' }}>
              <Card.Img variant="top" src="Images/Train.jpg" width="150" height="300"/>
              <Card.Body>
                <Card.Title>Train Model</Card.Title>
                <Card.Text>
                  Here you can Train your model using your dataset
                </Card.Text>
                <Link to="/TrainPage"> 
                  <Button className="button" variant="primary" type="button">Go to Train Page</Button>
                </Link>
              </Card.Body>
            </Card>
            </Col>
          
            <Col className="text-center mb-4" style={{ marginRight: '2rem' }}>
            <Card style={{ width: '23rem' }}>
              <Card.Img variant="top" src="Images/Test.jpg" width="150" height="300"/>
              <Card.Body>
                <Card.Title>Test Model</Card.Title>
                <Card.Text>
                   Here you can Test your model using your dataset
                </Card.Text>
                <Link to="/TestPage"> 
                <Button variant="primary">Go to Test Page</Button>
                </Link>
              </Card.Body>
            </Card>
            </Col>
  
            <Col className="text-center mb-4" style={{ marginRight: '2rem' }}>
            <Card style={{ width: '23rem' }}>
              <Card.Img variant="top" src="Images/Predict.png" width="150" height="300" />
              <Card.Body>
                <Card.Title>Predict Results</Card.Title>
                <Card.Text>
                  Here you can predict results of dataset through your trained model
                </Card.Text>
                <Link to="/ExecutePage"> 
                <Button variant="primary">Go to Predict Page</Button>
                </Link>
              </Card.Body>
            </Card>
            </Col>
  
            </Row>
            </div>
        </Container>
        </main>
        <footer class="py-5 my-5 bg-dark">
          <Container className="px-4">
            <p class="text-center text-white">© 2021 Oak Consulting, Inc. All rights reserved.</p>
          </Container>
        </footer>

    </Transitions>
    );
  }

  export default Home;