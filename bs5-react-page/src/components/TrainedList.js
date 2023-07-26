import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const TrainedList = ({ trainedModels }) => {
  return (
    <div>
      <h3>List of Trained Models</h3>
      <ListGroup>
        {trainedModels.map((model, index) => (
          <ListGroup.Item key={index}>{model.name}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TrainedList;