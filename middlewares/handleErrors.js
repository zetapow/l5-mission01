function handleErrors(error, req, res, next) {
   console.error("Error:", error.message);
   res.status(500).json({
      success: false,
      error: error.message,
   });
}

module.exports = handleErrors;
