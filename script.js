document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitUserInput")
    .addEventListener("click", () => generateContent());
});

const storedContent = localStorage.getItem("generatedContent");
if (storedContent) {
  document.getElementById("blogContent").innerHTML = storedContent;
}

const formatContent = (content) => {
  const paragraphs = content.split("\n\n");
  const title = paragraphs.shift();

  const formattedTitle = `<h1 class="text-center">${title}</h1>`;
  const formattedParagraphs = paragraphs
    .map((paragraph) => `<p class="text-indent">${paragraph}</p>`)
    .join("");

  return `${formattedTitle}${formattedParagraphs}`;
};

/* const animatedDisplay = (contentElement, content) => {
  const words = content.split(/\s+/); // Split content into words
  let currentWordIndex = 0;
  let accumulatedContent = "";

  const animateWord = () => {
    if (currentWordIndex < words.length) {
      const word = words[currentWordIndex];
      const formattedWord = formatContent(word);
      accumulatedContent += formattedWord;
      contentElement.innerHTML = accumulatedContent;
      currentWordIndex++;
      setTimeout(animateWord, 150);
    }
  };
  animateWord();
};
 */
const generateContent = async () => {
  console.log("Generating content");
  const userInput = document.getElementById("userInput").value;
  const userMessage = `Write an original blog on ${userInput} that has a title without the "Title: " prefix and the rest of the paragraphs also dont have prefixes or labels.`;
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.argv[2];
  console.log(apiKey);

  const blogContentElement = document.getElementById("blogContent");

  // Display loading spinner while content is being generated
  blogContentElement.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height: 200px;"><div class="spinner-border text-secondary" role="status"><span class="visually-hidden">Loading...</span></div></div>`;

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
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    // Save the response data or display it as needed
    const responseData = data.choices[0].message.content.trim();

    // Store the generated content in local storage
    localStorage.setItem("generatedContent", formatContent(responseData));

    // Display the generated content in the blogContent element
    blogContentElement.innerHTML = formatContent(responseData);
  } catch (error) {
    console.error("Error:", error);
  }
};
