// CsvHeadersModal.js
import React from 'react';
import stylesTrain from './TrainButtons.module.css';

const CsvHeadersModal = ({ show, handleClose, displayedCsvHeaders, outputFilePath, selectedYVariable, handleCheckboxChange, handleDropColumns, handleChooseYvariable }) => {
  if (!show) {
    return null;
  }

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
          <div className="selected-y-variable">
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
            <button type="button" className="btn btn-danger" onClick={handleDropColumns}>
              Drop Column
            </button>
            <button type="button" className="btn btn-success" onClick={handleChooseYvariable}>
              Choose Target Variable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvHeadersModal;
