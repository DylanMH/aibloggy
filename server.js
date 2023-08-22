const express = require("express");
const generateContent = require("./backend"); // Assuming your backend script is in the same directory

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse JSON in request bodies

app.get("/server", async (req, res) => {
  const { input } = req.query;
  const apiKey = process.env.OPEN_AI_KEY; // Access the API key from environment variable

  const content = await generateContent(input, apiKey);
  res.send(content);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
