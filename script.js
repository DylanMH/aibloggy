document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitUserInput")
    .addEventListener("click", async () => {
      const userInput = document.getElementById("userInput").value;
      const generateContentModule = await import("./backend.mjs"); // Import the module
      const generateContent = generateContentModule.default; // Access the default exported function
      const generatedContent = await generateContent(userInput);

      if (generatedContent) {
        document.getElementById("blogContent").textContent =
          formatContent(generatedContent);
      }
    });
});

// Rest of your code remains unchanged...

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
