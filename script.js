document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitUserInput")
    .addEventListener("click", async () => {
      const userInput = document.getElementById("userInput").value;

      console.log("fetching content");
      const response = await fetch("http://74.208.189.197:443/backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }), // Send user input as JSON
      });

      console.log(response.status);
      if (response.ok) {
        const generatedContent = await response.text();
        if (generatedContent) {
          document.getElementById("blogContent").innerHTML =
            formatContent(generatedContent);
        }
      } else {
        console.log(response.statusText);
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
