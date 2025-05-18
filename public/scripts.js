async function classifyFromUrl() {
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
      // First display the image preview
      preview.src = imageUrl;
      preview.style.display = "block";

      // Add event listeners for image loading/error
      await new Promise((resolve, reject) => {
         preview.onload = resolve;
         preview.onerror = () => {
            reject(
               new Error("Could not load the image. Please check the URL.")
            );
         };
      });

      // Then make the classification request
      const response = await fetch("http://localhost:3000/classify", {
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
      data.predictions.forEach((pred) => {
         const percent = Math.round(pred.probability * 100);
         html += `
               <div class="prediction">
                   <div class="prediction-label">${
                      pred.tagName || pred.tag
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
      preview.style.display = "none"; // Hide preview if there was an error
      resultsDiv.innerHTML = `
           <p class="error">Error: ${error.message}</p>
           <p>Please check the URL and try again.</p>
       `;
   }
}

// Optional: Add event listener for Enter key
document.getElementById("imageUrl").addEventListener("keypress", function (e) {
   if (e.key === "Enter") {
      classifyFromUrl();
   }
});
