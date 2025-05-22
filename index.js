require("dotenv").config();
const express = require("express");
const cors = require("cors");

/* Import external scripts */
const config = require("./config");
const predictionController = require("./controllers/predictionController");
const handleErrors = require("./middlewares/handleErrors");

const app = express();

/*  Middleware - cors, json  */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Prediction API endpoint
app.post("/predict", predictionController.predictImage);

// Handle errors
app.use(handleErrors);

app.listen(config.port, () => {
   console.log(`Server running on http://localhost:${config.port}`);
   // console.log("Custom Vision Configuration:", config.vision);
});
