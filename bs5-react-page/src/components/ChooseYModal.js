import React, { useState, useEffect } from 'react';
import stylesTrain from './TrainButtons.module.css';
import { Button } from 'react-bootstrap';

const ChooseYModal = ({ show, handleClose, displayedCsvHeaders, outputFilePath, selectedYVariable, handleCheckboxChange, handleDropColumns, handleChooseYvariable, setShowAlert }) => {
  const [chooseYClicked, setchooseYClicked] = useState(false);

  const closeAlert = () => {
    setShowAlert(false);
    setchooseYClicked(false);
  };

  const handleChooseYClick = () => {
    setchooseYClicked(true);
    handleChooseYvariable();
  };

  useEffect(() => {
    setchooseYClicked(false);
  }, [displayedCsvHeaders]);
  if (!show) {
    return null;
  }

  const noYSelected = chooseYClicked && !selectedYVariable;

  return (
    <div className={stylesTrain.modalBackdrop}>
      <div className={stylesTrain.modalContent}>
        <div className={stylesTrain.modalHeader}>
          <h2>CSV Headers</h2>
          <button className="btn-close" onClick={handleClose} aria-label="Close"></button>
        </div>
        <div className={stylesTrain.modalBody}>
          <div className={stylesTrain.csv}>
            CSV Filename: {outputFilePath}
          </div>
          <div className="selected-y-variable" style={{ fontWeight: 'bold' }}>
            Selected Y Variable: {selectedYVariable}
          </div>
          <div className={stylesTrain.csvHeaderList}>
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

          <div className={stylesTrain.buttonContainer}>
          <div className={stylesTrain.dropButtonWrapper}>
              <Button type="button" className="btn btn-success" onClick={handleChooseYClick}>
                Choose a Target Variable
              </Button>{' '}
             
              <Button type="button" className="btn btn-secondary" onClick={handleClose} aria-label="Close">
                Close
              </Button>
            </div>
          </div>
          {noYSelected && (
            <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
              Please select one header as Target Variable
              <button type="button" className="btn-close" onClick={closeAlert} aria-label="Close"></button>
            </div>
          )}
        </div>
      </div>4
    </div>
  );
};

export default ChooseYModal;
