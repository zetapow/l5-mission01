const { predictor } = require("../services/visionService");
const { getImageFromUrl } = require("../utils/imageUtil");

const predictImage = async (req, res) => {
   try {
      const { imageUrl } = req.body;
      if (!imageUrl) {
         return res.status(400).json({ error: "URL is required" });
      }

      const imageBuffer = await getImageFromUrl(imageUrl);
      const results = await predictor.classifyImage(
         process.env.VISION_ID,
         process.env.VISION_Name,
         imageBuffer
      );

      res.json({
         success: true,
         predictions: results.predictions.map((predict) => ({
            tag: predict.tagName,
            probability: predict.probability,
         })),
      });
   } catch (error) {
      console.error("Prediction error:", error);
      res.status(500).json({
         success: false,
         error: error.message,
      });
   }
};

module.exports = { predictImage };
