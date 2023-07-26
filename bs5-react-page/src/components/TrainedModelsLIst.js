import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const TrainedModelsList = ({ trainedModels }) => {
  return (
    <ListGroup>
      {trainedModels.map((model, index) => (
        <ListGroup.Item variant="info" key={index}>
          {model.name} - {model.status}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TrainedModelsList;