const express = require("express");

let generateContent;
try {
  generateContent = require("./backend.js");
} catch (error) {
  console.log(error);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse JSON in request bodies

app.get("/backend", async (req, res) => {
  const { input } = req.query;
  console.log(input);
  const apiKey = process.env.OPEN_AI_KEY; // Access the API key from environment variable

  const userMessage = `Write an original blog on ${input} that has a title without the "Title: " prefix and the rest of the paragraphs also dont have prefixes or labels.`;
  const API_URL = "https://api.openai.com/v1/chat/completions";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You selected theme: ${input}`,
        },
        { role: "user", content: userMessage },
      ],
    }),
  };

  try {
    // Use dynamic import for node-fetch
    const fetchModule = await import("node-fetch");
    const response = await fetchModule.default(API_URL, requestOptions);

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();
    res.send(generatedContent);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating content");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
