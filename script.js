// global variables
let isButtonEnabled = false;
const BUTTON_DELAY = 5000;

// format generated content function
const formatContent = (content) => {
  const paragraphs = content.split("\n\n");
  const title = paragraphs.shift();

  const formattedTitle = `<h1 class="text-center">${title}</h1>`;
  // remove any conclusion paragraph this stupid ai might generate
  const paragraphsWithoutLast = paragraphs.slice(0, -1);

  const formattedParagraphs = paragraphsWithoutLast
    .map((paragraph) => `<p class="text-indent">${paragraph}</p>`)
    .join("");

  return `${formattedTitle}${formattedParagraphs}`;
};

// logic to stop blogContent from clearing on refresh
const storedContent = localStorage.getItem("generatedContent");
if (storedContent) {
  document.getElementById("blogContent").innerHTML =
    formatContent(storedContent);
}

// main initialization function
document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitUserInput");
  const moreContentButton = document.getElementById("moreContent");

  const isContentLoaded =
    storedContent || document.getElementById("blogContent");
  if (isContentLoaded > 0) {
    moreContentButton.disabled = false;
  } else {
    moreContentButton.disabled = true;
  }

  // Event listener for the submit button
  submitButton.addEventListener("click", async () => {
    if (!isButtonEnabled) {
      isButtonEnabled = true; // disable the blog button
    }

    document.getElementById("blogContent").innerHTML = ""; // clear the blog content

    // display a loading spinner on click
    const generateContentSpinner = document.getElementById(
      "generateContentSpinner"
    );
    generateContentSpinner.style.display = "inline-block"; // show the spinner
    submitButton.disabled = true; // disable the submit button

    const userInput = document.getElementById("userInput").value;
    const aiInput = `generate a 3 paragraph blog without a conclusion and return it with no labels or prefixes but keep the title. The topic to write about is "${userInput}". Do not include "In conclusion".`;

    console.log("fetching content");
    try {
      const response = await fetch(
        `https://server.aibloggy.com:443/backend?input=${aiInput}`,
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
      generateContentSpinner.style.display = "none"; // Hide the spinner
      moreContentButton.disabled = false; // enable the more content button
      setTimeout(() => {
        isButtonEnabled = false; // reenable the blog button
        submitButton.disabled = false; // reenable the submit button
      }, BUTTON_DELAY);
    }
  });

  // Event listener for more content button
  moreContentButton.addEventListener("click", async () => {
    moreContentButton.disabled = true; // disable the more content button

    const currentContent =
      document.getElementById("blogContent").innerHTML ||
      localStorage.getItem("generatedContent"); // take out any html syntax for the ai interpreter

    // display a loading spinner on click
    const moreContentSpinner = document.getElementById("moreContentSpinner");
    moreContentSpinner.style.display = "inline-block"; // show the spinner

    // prompt that is sent to ai engine to generate the content
    const aiInput = `use the following content to generate 3 additional paragraphs and add them to the end original content. Return the whole prompt new content without any labels or prefixes, but keep the title. The content: "${currentContent}". Do not include "In conclusion"`;

    console.log("fetching content");
    try {
      const response = await fetch(
        `https://server.aibloggy.com:443/backend?input=${aiInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const generatedContent = await response.text();
        // if content is generated take insert it into the blog content element with the already generated blog content
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
      moreContentSpinner.style.display = "none"; // Hide the spinner
    }
  });

  const themeSelector = document.getElementById("themeSelector");

  const preferredTheme = localStorage.getItem("preferredTheme");

  if (preferredTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeSelector.checked = true;
  }

  themeSelector.addEventListener("change", () => {
    if (themeSelector.checked) {
      localStorage.setItem("preferredTheme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      localStorage.setItem("preferredTheme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  });
});
