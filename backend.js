const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

app.use(express.json());

app.post("/generate-content", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You selected theme: ${userInput}`,
          },
          {
            role: "user",
            content: `Write an original blog on ${userInput} that has a title without the "Title: " prefix and the rest of the paragraphs also dont have prefixes or labels.`,
          },
        ],
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    res.json(data.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
