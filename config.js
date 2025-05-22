module.exports = {
   port: process.env.PORT || 3000,
   vision: {
      predictionKey: process.env.VISION_PREDICTION_KEY,
      endpoint: process.env.VISION_ENDPOINT,
      projectId: process.env.VISION_ID,
      publishedName: process.env.VISION_NAME,
   },
};
