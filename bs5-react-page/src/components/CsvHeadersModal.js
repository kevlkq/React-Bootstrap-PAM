import React, { useState, useEffect } from 'react';
import stylesTrain from './TrainButtons.module.css';
import { Button } from 'react-bootstrap';

const CsvHeadersModal = ({ show, handleClose, displayedCsvHeaders, outputFilePath, handleCheckboxChange, handleDropColumns, setShowAlert }) => {
  const [dropButtonClicked, setDropButtonClicked] = useState(false);

  const closeAlert = () => {
    setShowAlert(false);
    setDropButtonClicked(false);
  };

  const handleDropColumnsClick = () => {
    setDropButtonClicked(true);
    handleDropColumns();
  };

  useEffect(() => {
    setDropButtonClicked(false);
  }, [displayedCsvHeaders]);

  if (!show) {
    return null;
  }

  const noColumnsSelected = dropButtonClicked && displayedCsvHeaders.every((header) => !header.selected);

  return (
    <div className={stylesTrain.modalBackdrop}>
      <div className={stylesTrain.modalContent}>
        <div className={stylesTrain.modalHeader}>
          <h2>Columns to Drop from Uploaded File</h2>
          <button className="btn-close" onClick={handleClose} aria-label="Close"></button>
        </div>
        <div className={stylesTrain.modalBody}>
          <div className={stylesTrain.csv}>
            CSV Filename: {outputFilePath}
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
              <Button type="button" className="btn btn-danger" onClick={handleDropColumnsClick}>
                Drop Column
              </Button>{' '}
             
              <Button type="button" className="btn btn-secondary" onClick={handleClose} aria-label="Close">
                Close
              </Button>
            </div>
          </div>

          {noColumnsSelected && dropButtonClicked && (
            <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
              Please select at least one column before dropping.
              <button type="button" className="btn-close" onClick={closeAlert} aria-label="Close"></button>
            </div>
          )}
          {!noColumnsSelected && dropButtonClicked && (
            <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
              Columns Dropped Successfully
              <button type="button" className="btn-close" onClick={closeAlert} aria-label="Close"></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvHeadersModal;
