import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Transitions from './Transition'
import { motion } from 'framer-motion';
import stylesTesting from './TestButtons.module.css';
import DatasetPreviewModal from './DatasetPreviewModal';
import CsvHeadersModal from './CsvHeadersModal';
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
import { Link } from 'react-router-dom';
// import DropColModal from './DropColModal'; 

const TrainingPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [displayedCsvHeaders, setDisplayedCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [editedCsvFilePath, setEditedCsvFilePath] = useState("");
  const [outputFilePath, setOutputFilePath] = useState('');
  const [selectedHeader, setSelectedHeader] = useState('');
  const [selectedYVariable, setSelectedYVariable] = useState('');
  const [results, setResults] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null); 
  const [showButtons, setShowButtons] = useState(false);
  const [showPreview, setShowPreview] = useState(false); 
  const handlePreviewDataset = () => {setShowPreview(true); };
  const handleCloseModal = () => {setShowPreview(false); };
  // const [DropColPreview, setDropColPreview] = useState(false); 
  // const handleDropColPreview = () => {setDropColPreview(true);};
  const [showCsvHeaders, setShowCsvHeaders] = useState(false);
  const handleShowCsvHeaders = () => {setShowCsvHeaders(true); };


  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }, [uploadStatus]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    setCsvFile(file);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    console.log('Uploading file:', csvFile);

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    axios
      .post('http://localhost:3333/upload-csv', formData)
      .then((response) => {
        console.log(response.data);

        setCsvData(response.data);
        const headers = Object.keys(response.data[0]);
        setDisplayedCsvHeaders(headers);
        setEditedCsvFilePath(response.data.editedCsvFilePath);
        const csvFilename = csvFile.name;
        setOutputFilePath(csvFilename);
        setUploadStatus('success');
        setShowButtons(true);
        setTimeout(() => setUploadStatus(''), 3000);

      })
      .catch((error) => {
        console.error(error);
        setUploadStatus('error');
        setShowButtons(false);
        setTimeout(() => setUploadStatus(''), 3000);

      });
  };

  const handleCheckboxChange = (e, header) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedColumns((prevSelectedColumns) => [...prevSelectedColumns, header]);
    } else {

      setSelectedColumns((prevSelectedColumns) =>
        prevSelectedColumns.filter((column) => column !== header)
      );

    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('yVariable', selectedYVariable); 
    const selectedModels = document.querySelectorAll('input[name="models"]:checked');
    const modelValues = Array.from(selectedModels).map((model) => model.value);
    formData.append('models', modelValues.join(','));
    const requestBody = Object.fromEntries(formData);
    console.log('Request body:', requestBody);

    axios
      .post('http://localhost:3333/TrainingModels', requestBody)
      .then((response) => {
        console.log(response.data);
        // setResults(data);
        // setIsOpen(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleDropColumns = () => {
    axios
      .post('http://localhost:3333/drop-columns', { columns: selectedColumns.toString() })
      .then((response) => {
        console.log('Selected columns to drop:', selectedColumns);

        const remainingHeaders = response.data.headers;
        setDisplayedCsvHeaders(remainingHeaders);
        var csvFilename = response.data.newfilepath.replace(/^.*[\\\/]/, '')
        setOutputFilePath(csvFilename);
        setSelectedColumns([]); 
        const checkboxes = document.querySelectorAll('input[name^="headerCheckbox_"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChooseYvariable = () => {
    if (selectedColumns.length === 1) {
      setSelectedYVariable(selectedColumns[0]); 
    } else {

      console.error('Please select one checkbox as the Y variable');
    }
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
              <Nav.Link as={Link} to="/ExecutePage">Predict</Nav.Link>
            </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    <div className={stylesTesting.container}>
      <div className={stylesTesting.modelsContainer}>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="mb-3">Select Models to Test</legend>
            <div className={stylesTesting.checkboxContainer}>
              <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="LinearRegression"
                    name="models"
                    value="LinearRegressionTest"
                  />
                  <label className="form-check-label" htmlFor="LinearRegression">
                    Linear Regression
                  </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="KNN"
                  name="models"
                  value="KNNTesting"
                />
                <label className="form-check-label" htmlFor="KNN">
                  KNN
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="SVM"
                  name="models"
                  value="SVMTesting"
                />
                <label className="form-check-label" htmlFor="SVM">
                  SVM
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="LSTM"
                  name="models"
                  value="LSTMTesting"
                />
                <label className="form-check-label" htmlFor="LSTM">
                  LSTM
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="RandomForest"
                  name="models"
                  value="RandomForestTesting"
                />
                <label className="form-check-label" htmlFor="RandomForest">
                  Random Forest
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="GradientBoost"
                  name="models"
                  value="GradientBoostTesting"
                />
                <label className="form-check-label" htmlFor="GradientBoost">
                  Gradient Boost
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="XGBoost"
                  name="models"
                  value="XGBoostTesting"
                />
                <label className="form-check-label" htmlFor="XGBoost">
                  XGBoost
                </label>
              </div>
            </div>
          </fieldset>
          <div className={stylesTesting.buttonsWrapper}>
          <div className={stylesTesting.buttonContainer}>
          <button type="submit" className="btn btn-success" >
                Choose Model(s) to Test
          </button>
          </div>
          </div>
        </form>
      </div>

      {/* <div className={stylesTesting.buttonContainer}>
        <form encType="multipart/form-data">
          <div className="mb-3">
            <input
              className="form-control"
              type="file"
              id="myFile"
              name="csvFile"
              onChange={handleFileChange}
            />
          </div>
            <div className={stylesTesting.buttonsWrapper}>
              <button type="button" className="btn btn-primary" onClick={handleUpload}>
                Upload CSV
              </button>
              {uploadStatus === 'success' && (
              <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                File uploaded successfully!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setUploadStatus('')}
                ></button>
              </div>
              )}
              {uploadStatus === 'error' && (
                <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                  Error uploading file. Please make sure you selected a valid CSV file.
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setUploadStatus('')}
                  ></button>
                </div>
              )}
              {showButtons && ( 
              <div className={stylesTesting.buttonsContainer}>
                <button type="button" className="btn btn-primary me-3" onClick={handlePreviewDataset}>
                  Preview of Dataset
                </button>
                <button type="button" className="btn btn-primary me-3"onClick={handleShowCsvHeaders}>
                  Choose Columns to Drop
                </button>
                <button type="button" className="btn btn-primary">
                  Choose Target Variable
                </button>
              </div>
              )}
        </form>
      </div> */}

      {/* Display CSV headers */}
      <CsvHeadersModal
      show={showCsvHeaders}
      handleClose={() => setShowCsvHeaders(false)}
      displayedCsvHeaders={displayedCsvHeaders}
      outputFilePath={outputFilePath}
      selectedYVariable={selectedYVariable}
      handleCheckboxChange={handleCheckboxChange}
      handleDropColumns={handleDropColumns}
      handleChooseYvariable={handleChooseYvariable}
    />
    <DatasetPreviewModal show={showPreview} handleClose={handleCloseModal} data={csvData} />
    {/* <DropColModal show={DropColPreview} handleClose={() => setDropColPreview(false)} /> */}
    </div>
    </Transitions>
  );
};

export default TrainingPage;


