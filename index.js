require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const {
   PredictionAPIClient,
} = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Configure Azure Custom Vision
const predictor = new PredictionAPIClient(
   new ApiKeyCredentials({
      inHeader: { "Prediction-key": process.env.VISION_PREDICTION_KEY },
   }),
   process.env.VISION_ENDPOINT
);

// Helper function with timeout and better error handling
async function getImageFromUrl(url) {
   try {
      const response = await axios.get(url, {
         responseType: "arraybuffer",
         timeout: 10000, // 10 seconds timeout
      });
      return Buffer.from(response.data, "binary");
   } catch (error) {
      console.error("Image download failed:", error.message);
      throw new Error(`Could not download image from URL: ${error.message}`);
   }
}

// Classification endpoint with error handling
app.post("/classify", async (req, res) => {
   try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
         return res.status(400).json({ error: "Image URL is required" });
      }

      console.log("Downloading image from:", imageUrl);
      const imageBuffer = await getImageFromUrl(imageUrl);

      console.log("Classifying image...");
      const results = await predictor.classifyImage(
         process.env.VISION_ID,
         process.env.VISION_NAME,
         imageBuffer
      );

      console.log("Classification successful");
      res.json({
         success: true,
         predictions: results.predictions.map((p) => ({
            tag: p.tagName,
            probability: p.probability,
         })),
      });
   } catch (error) {
      console.error("Classification error:", error);
      res.status(500).json({
         success: false,
         error: error.message,
         details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
   }
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
   console.log("Custom Vision Config:", {
      endpoint: process.env.VISION_ENDPOINT,
      projectId: process.env.VISION_ID,
      publishedName: process.env.VISION_NAME,
   });
});
