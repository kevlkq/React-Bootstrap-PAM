const { PythonShell } = require('python-shell');
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const ejs = require('ejs');
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const stringify = require('csv-stringify');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = require('csv-write-stream');
let uploadedCsvFilePath = '';
let editedCsvFilePath = ''; // Declare the global variable for edited CSV file path

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with the URL of your React development server
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload-csv', upload.single('csvFile'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded');
      return;
    }

    const file = req.file;
    console.log('Uploaded file:', file);
    uploadedCsvFilePath = file.path;
    const results = [];
    fs.createReadStream(uploadedCsvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        res.json(results);
      });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

app.post('/drop-columns', (req, res) => {
  try {
    const { columns } = req.body;
    const dropColumns = columns.split(',');

    const inputFilePath = uploadedCsvFilePath;
    const outputFilePath = inputFilePath.replace('.csv', '_edited.csv');
    editedCsvFilePath = outputFilePath; 
    uploadedCsvFilePath= outputFilePath;

    const readStream = fs.createReadStream(inputFilePath);
    const writeStream = fs.createWriteStream(outputFilePath);
    const writer = csvWriter();

    const remainingHeaders = [];

    readStream
      .pipe(csv())
      .on('data', (row) => {
        const remainingRow = {};
        Object.keys(row).forEach((header) => {
          if (!dropColumns.includes(header)) {
            remainingRow[header] = row[header];
            if (!remainingHeaders.includes(header)) {
              remainingHeaders.push(header);
            }
          }
        });
        writer.write(remainingRow);
      })
      .on('end', () => {
        writer.end();
      });

    writeStream.on('finish', () => {
      console.log(editedCsvFilePath);
      res.status(200).json({ message: 'Columns dropped successfully', headers: remainingHeaders, newfilepath: editedCsvFilePath });
    });

    writer.pipe(writeStream);
  } catch (error) {
    console.error('Error dropping columns:', error);
    res.status(500).json({ error: 'Failed to drop columns' });
  }
});


app.post('/trainModels', (req, res) => {
  const csvFilePath = uploadedCsvFilePath;
  const selectedModels = req.body.models.split(',');
  const y = req.body.yVariable;

  const runModel = (modelName, callback) => {
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, 'Train'),
      args: [csvFilePath, y],
    };

    PythonShell.run(`${modelName}.py`, options)
      .then(() => {
        callback();
      })
      .catch((err) => {
        console.error(err);
        callback(err);
      });
  };

  const processNextModel = (index) => {
    if (index >= selectedModels.length) {
      console.log('Finished training all models');
      return;
    }

    const modelName = selectedModels[index];
    console.log('modelName:', modelName); 
    runModel(modelName, (err) => {
      if (err) {
        res.status(500).send(`Error running ${modelName}`);
      } else {
        console.log(csvFilePath);
        processNextModel(index + 1);
      }
    });
  };
  processNextModel(0);
});

app.post('/testModels', (req, res) => {
  const csvFilePath = uploadedCsvFilePath;
  const selectedModels = req.body.models.split(',');
  const y = req.body.yVariable;

  const runModel = (modelName) => {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: path.join(__dirname, 'Test'),
        args: [csvFilePath, y],
      };
  
      PythonShell.run(`${modelName}.py`, options)
      .then((results) => {
        const x = results.length;
        const r2error = parseFloat(results[x - 2]);
        const rmse = parseFloat(results[x - 1]);
        console.log('R-squared Score:', r2error);
        console.log('Root Mean Squared Error:', rmse);

        const resultObject = { modelName, rmse, r2error };
        resolve(resultObject);
      })
      .catch((err) => {
        console.error(err);
        reject(`Error running ${modelName}`);
      });
  });
};
  
  const processNextModel = (index, selectedModels, modelResults) => {
    if (index >= selectedModels.length) {
      const resultObject = {};
      for (const result of modelResults) {
        resultObject[result.modelName] = {
          rmse: result.rmse,
          r2error: result.r2error,
        };
      }
      const jsonResponse = JSON.stringify(resultObject, null, 2);
      res.status(200).type('json').send(jsonResponse);
      return;
    }
  
    const modelName = selectedModels[index];
    console.log('modelName:', modelName);
  
    runModel(modelName)
      .then((result) => {
        modelResults.push(result);
        processNextModel(index + 1, selectedModels, modelResults);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };
  
  processNextModel(0, selectedModels, []);
  
  
});

app.post('/executeModels', (req, res) => {
  const csvFilePath = uploadedCsvFilePath;
  const selectedModels = req.body.models.split(',');
  // const y = req.body.yVariable;

  const runModel = (modelName) => {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: path.join(__dirname, 'Execute'),
        args: [csvFilePath],
      };
  
      PythonShell.run(`${modelName}.py`, options)
        .then((results) => {
          console.log('Predictions saved at /uploads');
          resolve({ modelName});
        })
        .catch((err) => {
          console.error(err);
          reject(`Error running ${modelName}`);
        });
    });
  };
  
  const processNextModel = (index, selectedModels, modelResults) => {
    if (index >= selectedModels.length) {
      const resultObject = {};
      for (const result of modelResults) {
        resultObject[result.modelName] = {
          rmse: result.rmse,
          r2error: result.r2error,
        };
      }
      const jsonResponse = JSON.stringify(resultObject, null, 2);
      res.status(200).type('json').send(jsonResponse);
      return;
    }
  
    const modelName = selectedModels[index];
    console.log('modelName:', modelName);
  
    runModel(modelName)
      .then((result) => {
        modelResults.push(result);
        processNextModel(index + 1, selectedModels, modelResults);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };
  
  processNextModel(0, selectedModels, []);
  
  
});

const port = process.env.REACT_APP_SERVER_PORT || 3333;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});