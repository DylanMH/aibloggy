document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitUserInput")
    .addEventListener("click", async () => {
      const userInput = document.getElementById("userInput").value;

      const response = await fetch("74.208.189.197:3000/backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }), // Send user input as JSON
      });

      if (response.ok) {
        const generatedContent = await response.text();
        if (generatedContent) {
          document.getElementById("blogContent").innerHTML =
            formatContent(generatedContent);
        }
      }
    });
});

// Rest of your script.js code

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
