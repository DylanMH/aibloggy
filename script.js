document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitUserInput")
    .addEventListener("click", async () => {
      const userInput = document.getElementById("userInput").value;

      const response = await fetch(`/backend?input=${userInput}`);
      if (response.ok) {
        const generatedContent = await response();
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
