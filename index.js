require("dotenv").config();

const {
   PredictionAPIClient,
} = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

async function main() {
   const customVisionPredictionKey = process.env["customVisionPredictionKey"];
   const customVisionPredictionEndPoint =
      process.env["customVisionPredictionEndPoint"];
   const projectId = process.env["projectId"];

   const credentials = new ApiKeyCredentials({
      inHeader: { "Prediction-key": customVisionPredictionKey },
   });
   const client = new PredictionAPIClient(
      credentials,
      customVisionPredictionEndPoint
   );

   const imageURL =
      "https://trademe.tmcdn.co.nz/photoserver/1024sq/2170973942.jpg";

   client
      .classifyImageUrl(projectId, "Iteration1", { url: imageURL })
      .then((result) => {
         console.log("The result is: ");
         console.log(result);
      })
      .catch((err) => {
         console.log("An error occurred:");
         console.error(err);
      });
}

main();
