import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Transitions from './Transition'
import { motion } from 'framer-motion';
import './TrainButtons.css';



const TrainPage = () => {
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
      })
      .catch((error) => {
        console.error(error);
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
      .post('http://localhost:3333/TrainModels', requestBody)
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
    <div className="container">
      <div className="models-container">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="mb-3">Select Models to Train</legend>
            <div className="checkbox-container d-flex flex-wrap">
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
            <button type="submit" className="btn btn-primary">
              Train Selected Models
            </button>
          </fieldset>
        </form>
      </div>

      <div className="button-container">
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
          <button type="button" className="btn btn-primary" onClick={handleUpload}>
            Upload CSV
          </button>
        </form>
      </div>

      {/* Display CSV headers */}
      {displayedCsvHeaders.length > 0 && (
        <div className="csv-data-container">
          <div className="csv-header-container">
            <h2>CSV Headers</h2>
            <div className="csv-filename">CSV Filename: {outputFilePath}</div>
            <div className="selected-y-variable">
              Selected Y Variable: {selectedYVariable}
            </div>
            <div className="csv-header-list">
              {displayedCsvHeaders.map((header, index) => (
                <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`headerCheckbox_${index}`}
                    name={`headerCheckbox_${index}`}
                    value={header}
                    onChange={(e) => handleCheckboxChange(e, header)}
                  />
                  <label className="form-check-label" htmlFor={`headerCheckbox_${index}`}>
                    {header}
                  </label>
                </div>
              ))}
            </div>
            <div className="btn-container">
              <button type="button" className="btn btn-danger" onClick={handleDropColumns}>
                Drop Column
              </button>
              <button type="button" className="btn btn-success" onClick={handleChooseYvariable}>
                Choose Target Variable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Transitions>
  );
};

export default TrainPage;













// import React, { useState } from 'react';
// import axios from 'axios';
// import './TrainButtons.css';

// const TrainPage = () => {
//   const [selectedModels, setSelectedModels] = useState([]);
//   const [csvFile, setCsvFile] = useState(null);

//   const handleModelChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedModels((prevModels) => [...prevModels, value]);
//     } else {
//       setSelectedModels((prevModels) => prevModels.filter((model) => model !== value));
//     }
//   };
              
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     console.log('Selected file:', file);
//     setCsvFile(file);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
  
//     const formData = new FormData();
//     formData.append('csvFile', csvFile);
  
//     const selectedModels = document.querySelectorAll('input[name="models"]:checked');
//     selectedModels.forEach((model) => {
//       formData.append('models', model.value);
//     });
//     console.log("BEUIFGBAQUIGBIGIBIG",formData);
//     axios
//       .post('http://localhost:3333/trainModels', formData)
//       .then((response) => {
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };
  

//   const handleUpload = (e) => {
//     e.preventDefault();

//     console.log('Uploading file:', csvFile);

//     const formData = new FormData();
//     formData.append('csvFile', csvFile);

//     axios
//       .post('http://localhost:3333/upload-csv', formData)
//       .then((response) => {
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

  

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//       <fieldset>
//           <legend>Select Models to Train</legend>

//           <div className="model-checkbox">
//             <input
//               type="checkbox"
//               id="LinearRegression"
//               name="models"
//               value="LinearRegressionTrain"
//               // onChange={handleModelChange}
//             />
//             <label htmlFor="LinearRegression">LinearRegression</label>
//           </div>
              
//           <div className="model-checkbox">
//             <input
//                 type="checkbox"
//                 id="KNN"
//                 name="models"
//                 value="KNNTrain"
//                 // onChange={handleModelChange}
//               />
//             <label htmlFor="KNN">KNN</label>
//           </div>

//           <div className="model-checkbox">
//             <input
//                 type="checkbox"
//                 id="svm"
//                 name="models"
//                 value="SVMTrain"
//                 // onChange={handleModelChange}
//               />
//             <label htmlFor="svm">SVM</label>
//           </div>

//           <div className="model-checkbox">
//             <input
//                 type="checkbox"
//                 id="lstm"
//                 name="models"
//                 value="LSTMTrain"
//                 // onChange={handleModelChange}
//               />
//             <label htmlFor="LSTM">LSTM</label>
//           </div>

//           <div className="model-checkbox">
//             <input
//                 type="checkbox"
//                 id="randomForest"
//                 name="models"
//                 value="RandomForestTrain"
//                 // onChange={handleModelChange}
//               />
//             <label htmlFor="randomForest">Random Forest</label>
//           </div>

//           <div className="model-checkbox">
//             <input
//                 type="checkbox"
//                 id="gradientBoost"
//                 name="models"
//                 value="GradientBoostTrain"
//                 // onChange={handleModelChange}
//               />
//             <label htmlFor="gradientBoost">Gradient Boost</label>
//           </div>

//           <div className="model-checkbox">
//             <input
//                 type="checkbox"
//                 id="xgBoost"
//                 name="models"
//                 value="XGBoostTrain"
//                 // onChange={handleModelChange}
//               />
//             <label htmlFor="XGBoost">LSTM</label>
//           </div>

//           <input type="hidden" name="csvFilePath" value="csvFilePath" />
//           <input type="submit" value="Run Selected Models" className="button" />
//         </fieldset>

//       </form>

//       <div className="button-container">
//       <form encType="multipart/form-data">
//           <input type="file" id="myFile" name="csvFile" onChange={handleFileChange} />
//           <button type="button" onClick={handleUpload}>Upload CSV</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TrainPage;
