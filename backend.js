const generateContent = async (userInput) => {
  const userMessage = `Write an original blog on ${userInput} that has a title without the "Title: " prefix and the rest of the paragraphs also dont have prefixes or labels.`;
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.OPEN_AI_KEY; // Access the API key from environment variable

  const fetchModule = await import("node-fetch"); // Dynamically import node-fetch

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
          content: `You selected theme: ${userInput}`,
        },
        { role: "user", content: userMessage },
      ],
    }),
  };

  try {
    const response = await fetchModule.default(API_URL, requestOptions);
    const data = await response.json();
    console.log(data);
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

module.exports = generateContent;
