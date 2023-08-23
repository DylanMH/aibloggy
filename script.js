const formatContent = (content) => {
  const paragraphs = content.split("\n\n");
  const title = paragraphs.shift();

  const formattedTitle = `<h1 class="text-center">${title}</h1>`;
  const formattedParagraphs = paragraphs
    .map((paragraph) => `<p class="text-indent">${paragraph}</p>`)
    .join("");

  return `${formattedTitle}${formattedParagraphs}`;
};

let isButtonEnabled = false;
const BUTTON_DELAY = 5000;

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitUserInput");

  submitButton.addEventListener("click", async () => {
    if (!isButtonEnabled) {
      isButtonEnabled = true; // disable the blog button
    }

    document.getElementById("blogContent").innerHTML = ""; // clear the blog content
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "inline-block"; // show the spinner
    submitButton.disabled = true; // disable the submit button

    const userInput = document.getElementById("userInput").value;

    console.log("fetching content");
    try {
      const response = await fetch(
        `https://server.aibloggy.com:443/backend?input=${userInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const generatedContent = await response.text();
        if (generatedContent) {
          document.getElementById("blogContent").innerHTML =
            formatContent(generatedContent);
          localStorage.setItem("generatedContent", generatedContent);
        }
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      loadingSpinner.style.display = "none"; // Hide the spinner
      setTimeout(() => {
        isButtonEnabled = false; // reenable the blog button
        submitButton.disabled = false; // reenable the submit button
      }, BUTTON_DELAY);
    }
  });
});

const storedContent = localStorage.getItem("generatedContent");
if (storedContent) {
  document.getElementById("blogContent").innerHTML =
    formatContent(storedContent);
}
