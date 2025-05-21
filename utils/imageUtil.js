const axios = require("axios");

async function getImageFromUrl(url) {
   try {
      const response = await axios.get(url, {
         responseType: "arraybuffer",
         timeout: 10000,
      });
      return Buffer.from(response.data, "binary");
   } catch (error) {
      console.error("Image retrieval failed:", error.message);
      throw new Error(`Could not get image from URL: ${error.message}`);
   }
}

module.exports = { getImageFromUrl };
