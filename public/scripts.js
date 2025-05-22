/**
 * Function to classify car from URL
 */

async function classifyFromUrl() {
   // DOM elements
   const urlInput = document.getElementById("imageUrl");
   const resultsDiv = document.getElementById("results");
   const preview = document.getElementById("imagePreview");

   // Clear previous results and errors
   resultsDiv.innerHTML = '<p class="loading">Processing image...</p>';

   // Validate input
   const imageUrl = urlInput.value.trim();
   if (!imageUrl) {
      resultsDiv.innerHTML = '<p class="error">Please enter an image URL</p>';
      return;
   }

   try {
      // Display image preview
      preview.src = imageUrl;
      preview.style.display = "block";

      // Event listeners for image loading/error
      await new Promise((resolve, reject) => {
         preview.onload = resolve;
         preview.onerror = () => {
            reject(
               new Error("Could not load the image. Please check the URL.")
            );
         };
      });

      // Make request to backend API
      const response = await fetch("http://localhost:3000/predict", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ imageUrl: imageUrl }),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(
            errorData.error || `Request failed with status ${response.status}`
         );
      }

      const data = await response.json();

      if (!data.predictions || !Array.isArray(data.predictions)) {
         throw new Error("Invalid response format from server");
      }

      // Display results
      let html = "<h3>Car Type Prediction</h3>";
      data.predictions.forEach((predict) => {
         const percent = Math.round(predict.probability * 100);
         html += `
               <div class="prediction">
                   <div class="prediction-label">${
                      predict.tagName || predict.tag
                   }: ${percent}%</div>
                   <div class="progress-bar">
                       <div class="progress" style="width: ${percent}%"></div>
                   </div>
               </div>
           `;
      });

      resultsDiv.innerHTML = html || "<p>No predictions returned</p>";
   } catch (error) {
      console.error("Classification error:", error);
      // Hide preview if there was an error
      preview.style.display = "none";
      resultsDiv.innerHTML = `
           <p class="error">Error: ${error.message}</p>
           <p>Please check the URL and try again.</p>
       `;
   }
}

// Event listener for Enter key
document.getElementById("imageUrl").addEventListener("keypress", function (e) {
   if (e.key === "Enter") {
      classifyFromUrl();
   }
});
