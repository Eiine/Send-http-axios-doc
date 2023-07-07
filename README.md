# Send-http-axios-doc

Send-http-axios-doc is a module for API documentation. It provides functionality to download, import, and generate endpoints for saving API data.

## Installation

To use Send-http-axios-doc, follow these steps:

1. Install the module using npm:

npm install send-http-axios-doc

## Usage

Follow the steps below to use Send-http-axios-doc in your API application:

2. Import the module in your API application:

import { createJsonApi, saveQueryBack } from "send-http-axios-doc";

3. Add the "send" folder to your static files:

app.use(express.static('send'));

4. Create the createJsonApi function and pass the app and port:

createJsonApi(app, port);

Make sure to replace app with the actual instance of your Express application and port with the desired port number for your API to run on.

Example
Here's an example of how you can use Send-http-axios-doc in your API application:

import express from "express";
import { createJsonApi, saveQueryBack } from "send-http-axios-doc";

const app = express();
const port = 3000;

app.use(express.static('send'));
app.use("/saveQuery", saveQueryBack);

createJsonApi(app, port);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

Support
For any issues or questions, please open an issue on the GitHub repository.

License
This project is licensed under the ISC License.