const {
   PredictionAPIClient,
} = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const predictor = new PredictionAPIClient(
   new ApiKeyCredentials({
      inHeader: { "Prediction-key": process.env.VISION_PREDICTION_KEY },
   }),
   process.env.VISION_ENDPOINT
);

module.exports = { predictor };
