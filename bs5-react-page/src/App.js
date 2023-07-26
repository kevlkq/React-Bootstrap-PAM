import './App.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Home from './components/Home';
import TrainPage from './components/TrainPage';
import TestPage from './components/TestPage';
// import ExecutePage from './components/ExecutePage';
import { AnimatePresence } from 'framer-motion';
import EvaluatePage from './components/EvaluatePage';



const Animated = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode='wait' >
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/TrainPage" element={<TrainPage />} />
        <Route exact path="/TestPage" element={<TestPage />} />
        <Route exact path="/Evaluate" element={<EvaluatePage />} />

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="App">
      <>
        <Router>
          <Animated />
        </Router>
      </>
    </div>
  );
}

export default App;
