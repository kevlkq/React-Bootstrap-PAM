import React from 'react';
import stylesTrain from './TrainButtons.module.css';

const DatasetPreview = ({ data }) => {
  return (
    <div className={stylesTrain.tableContainer}>
      <div className="table-wrapper">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              {/* Assuming data contains the header names */}
              {data.length > 0 &&
                Object.keys(data[0]).map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {/* Render the rows */}
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetPreview;