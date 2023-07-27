import React, { useState, useEffect, useRef } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Transitions from './Transition'
import { motion } from 'framer-motion';
import stylesTrain from './TrainButtons.module.css';
import DatasetPreviewModal from './DatasetPreviewModal';
import CsvHeadersModal from './CsvHeadersModal';
import ChooseYModal from './ChooseYModal';
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
import { useNavigate } from 'react-router-dom';




const TrainPage = ({ initialTrainedModelInfo }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [displayedCsvHeaders, setDisplayedCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [editedCsvFilePath, setEditedCsvFilePath] = useState("");
  const [outputFilePath, setOutputFilePath] = useState('');
  const [selectedHeader, setSelectedHeader] = useState('');
  const [selectedYVariable, setSelectedYVariable] = useState('');

  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null); 
  const [showButtons, setShowButtons] = useState(false);
  const [showPreview, setShowPreview] = useState(false); 
  const handlePreviewDataset = () => {setShowPreview(true); };
  const handleCloseModal = () => {setShowPreview(false); };
  // const [DropColPreview, setDropColPreview] = useState(false); 
  // const handleDropColPreview = () => {setDropColPreview(true);};
  const [showCsvHeaders, setShowCsvHeaders] = useState(false);
  const [chooseY, setchooseY] = useState(false);
  const handleShowCsvHeaders = () => {setShowCsvHeaders(true); };
  const handleChooseY = () => {setchooseY(true); };
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const closeAlert = () => {setShowAlert(false);};
  const [isYVariableSelected, setIsYVariableSelected] = useState(false);
  const [showToolTip, setshowToolTip] = useState(false);
  const [isModelSelected, setIsModelSelected] = useState(false);
  const [selectedModels, setSelectedModels] = useState([]);
  const [results, setResults] = useState([]);
  const [showTrainedModels, setShowTrainedModels] = useState(false);
  const [csvFilenames, setCsvFilenames] = useState({});
  const navigate = useNavigate()
  const [trainedModelInfo, setTrainedModelInfo] = useState(initialTrainedModelInfo || []);

  const handleEvaluate = () => {
    navigate('/Evaluate', { state: { trainedModelInfo } });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel'];
      if (allowedFileTypes.includes(file.type)) {
        setCsvFile(file);
      } else {
        setUploadStatus('error');
        setShowButtons(false);
        setTimeout(() => setUploadStatus(''), 30000);
      }
    }
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
        setTimeout(() => setUploadStatus(''), 30000);

      })
      .catch((error) => {
        console.error(error);
        setUploadStatus('error');
        setShowButtons(false);
        setTimeout(() => setUploadStatus(''), 30000);

      });
  };

  const handleCheckboxChange = (e, header) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedColumns((prevSelectedColumns) => [...prevSelectedColumns, header]);
      setSelectedModels((prevSelectedModels) => [...prevSelectedModels, e.target.value]);
    } else {
      setSelectedColumns((prevSelectedColumns) =>
        prevSelectedColumns.filter((column) => column !== header)
      );
      setSelectedModels((prevSelectedModels) =>
        prevSelectedModels.filter((model) => model !== e.target.value)
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
    .post('http://localhost:3333/trainModels', requestBody, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        // Assuming that 'progress' is the training progress percentage sent by the server
        setResults((prevResults) =>
          prevResults.map((model) => ({
            ...model,
            status: progress < 100 ? "Training" : "Finished",
          }))
        );
      },
    })
    .then((response) => {
      const trainedModels = response.data.trainedModels;
      const updatedResults = trainedModels.map((modelName) => ({
        name: modelName,
        status: 'Finished',
        csvFilename: outputFilePath,
      }));
      

      setResults((prevResults) => [...prevResults, ...updatedResults]);

      setAlertMessage(response.data.message);
      setShowAlert(true);

      const modelCsvInfo = trainedModels.map((modelName) => [
        modelName,
        outputFilePath,
        selectedYVariable, 
      ]);
      setTrainedModelInfo((prevInfo) => [...prevInfo, ...modelCsvInfo]);


    })
    .catch((error) => {
      console.error(error);
    });
};
  


  const handleDropColumns = () => {
    const checkboxes = document.querySelectorAll('input[name^="headerCheckbox_"]:checked');
    if (checkboxes.length === 0) {
      setShowAlert(true);
      return;
    }
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
      setSelectedColumns([]); 
      const checkboxes = document.querySelectorAll('input[name^="headerCheckbox_"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    } else {
      console.error('Please select one checkbox as the Y variable');
    }
  };

  useEffect(() => {
    setTrainedModelInfo(initialTrainedModelInfo || []);
  }, [initialTrainedModelInfo]);

  useEffect(() => {
    setIsYVariableSelected(!!selectedYVariable);
  }, [selectedYVariable]);

  // useEffect(() => {
  //   setIsModelSelected(false); // Reset the model selected state when Y variable changes
  // }, [selectedYVariable]);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }, [uploadStatus]);

  useEffect(() => {
    const selectedModels = document.querySelectorAll('input[name="models"]:checked');
    setIsModelSelected(selectedModels.length > 0);
  }, [selectedColumns]);

  useEffect(() => {
    setIsModelSelected(selectedModels.length > 0);
  }, [selectedModels]);
  
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
      <legend className="mb-3 mt-5" style={{ fontSize: '36px', fontWeight: 'bold', whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center' }}> Select Models to Train</legend>
    <div className={stylesTrain.container}>
      <div className={stylesTrain.modelsContainer}>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className={stylesTrain.checkboxContainer}>
              <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="LinearRegression"
                    name="models"
                    value="LinearRegressionTrain"
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
                  value="KNNTrain"
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
                  value="SVMTrain"
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
                  value="LSTMTrain"
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
                  value="RandomForestTrain"
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
                  value="GradientBoostTrain"
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
                  value="XGBoostTrain"
                />
                <label className="form-check-label" htmlFor="XGBoost">
                  XGBoost
                </label>
              </div>
            </div>
          </fieldset>
        </form>
      </div>

      <div className={stylesTrain.buttonContainer}>
        <form encType="multipart/form-data">
        <div className={`mb-3 ${stylesTrain.fileInputContainer}`}>
          <input
            className="form-control"
            type="file"
            id="myFile"
            name="csvFile"
            onChange={handleFileChange}
          />
        </div>
          <div className={stylesTrain.buttonsWrapper}>
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
            <div className={stylesTrain.buttonsContainer}>
              <button type="button" className="btn btn-primary me-3" onClick={handlePreviewDataset}>
                Preview of Dataset
              </button>
              <button type="button" className="btn btn-primary me-3" onClick={handleShowCsvHeaders}>
                Choose Columns to Drop
              </button>
              <button type="button" className="btn btn-primary"  onClick={handleChooseY}>
                Choose Target Variable
              </button>
            </div>
            )}
            
            <div
              onMouseEnter={() => {
                setshowToolTip(true);
              }}
              onMouseLeave={() => {
                setshowToolTip(false);
              }}
            >
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={!isYVariableSelected || !isModelSelected}

              >
                Train Selected Models
              </button>
              </div>
              {showToolTip && (!isModelSelected || !isYVariableSelected) && (
              <div>
                Choose a Model to Train and Target Variable First
              </div>
            )}

            {alertMessage && showAlert && (
            <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
              {alertMessage}
              <button type="button" className="btn-close" onClick={closeAlert} aria-label="Close"></button>
            </div>
            )} 
            <div>
              {results.length  > 0 && (
                <div className='mb-5'>
                  <h3>Trained Models</h3>
                  <ListGroup>
                    {trainedModelInfo.map(([modelName, csvFilename], index) => (
                      <ListGroup.Item variant="info" key={index}>
                        {modelName} - Finished Training
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </div>
          </div>
          {results.length > 0  && trainedModelInfo.length>0 &&(
            <div className={stylesTrain.biggerButton}>
              <Button variant='warning' type="button" className="btn btn-success btn-block" size="lg" onClick={handleEvaluate}>
                Evaluate
              </Button>
            </div>
          )}
        </form>
      </div>

    <ChooseYModal show={chooseY} handleClose={() => setchooseY(false)} displayedCsvHeaders={displayedCsvHeaders} outputFilePath={outputFilePath} selectedYVariable={selectedYVariable} handleCheckboxChange={handleCheckboxChange} handleDropColumns={handleDropColumns} handleChooseYvariable={handleChooseYvariable} setShowAlert={setShowAlert}/>
    <CsvHeadersModal show={showCsvHeaders} handleClose={() => setShowCsvHeaders(false)} displayedCsvHeaders={displayedCsvHeaders} outputFilePath={outputFilePath} selectedYVariable={selectedYVariable} handleCheckboxChange={handleCheckboxChange} handleDropColumns={handleDropColumns} handleChooseYvariable={handleChooseYvariable} setShowAlert={setShowAlert}/>
    <DatasetPreviewModal show={showPreview} handleClose={handleCloseModal} data={csvData} />

    </div>
    </Transitions>
  );
};

export default TrainPage;


