require("dotenv").config();

// npm packages
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const {
   PredictionAPIClient,
} = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

// Set up express
const app = express();

const upload = multer({ dest: "/uploads" });

// cors for front end
app.use(
   cors({
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
   })
);
app.options("*", cors());
app.use(express.static("public"));

app.use(express.json());

// Custom vision env
const predictionKey = process.env.VISION_PREDICTION_KEY;
const endpoint = process.env.VISION_ENDPOINT;
const projectId = process.env.VISION_ID;
const projectName = process.env.VISION_NAME;

console.log("Prediction Key:", !!predictionKey);
console.log("Endpoint:", endpoint);

const credentials = new ApiKeyCredentials({
   inHeader: { "Prediction-Key": predictionKey },
});
const predictor = new PredictionAPIClient(credentials, endpoint);

// Routes
app.get("/", (req, res) => {
   res.sendFile(__dirname + "/public/index.html");
});

app.post("/classify", upload.single("image"), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({ error: "No image uploaded" });
      }

      const imageBuffer = fs.readFileSync(req.file.path);

      const results = await predictor.classifyImage(
         projectId,
         projectName,
         imageBuffer
      );

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      // Format results
      const predictions = results.predictions.map((p) => ({
         tag: p.tagName,
         probability: p.probability,
      }));

      res.json({ predictions });
   } catch (error) {
      console.error("Classification error:", error);
      res.status(500).json({
         error: "Classification failed",
         details: error.message,
      });
   }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
