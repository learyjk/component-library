const htmlToElement = (htmlString) => {
  var template = document.createElement("template");
  htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = htmlString;
  return template.content.firstChild;
};

const escapeHtml = (htmlString) => {
  const rAmp = /&/g;
  const rLt = /</g;
  const rApos = /\'/g;
  const rQuot = /\"/g;
  const hChars = /[&<>\"\']/;

  if (htmlString == null) {
    return htmlString;
  }

  if (typeof htmlString !== "string") {
    htmlString = String(htmlString);
  }

  if (hChars.test(String(htmlString))) {
    return htmlString
      .replace(rAmp, "&amp;")
      .replace(rLt, "&lt;")
      .replace(rApos, "&apos;")
      .replace(rQuot, "&quot;");
  } else {
    return htmlString;
  }
};

const init = async () => {
  const slug = document.querySelector('[wb-data="slug"]').textContent;
  let url = `https://raw.githubusercontent.com/learyjk/component-library/main/${slug}.html`;

  try {
    const response = await fetch(url);
    const data = await response.text();

    // Add preview to page
    let preview = htmlToElement(data);
    document.querySelector(".main-wrapper").prepend(preview);
    // restart IX2
    Webflow.destroy();
    Webflow.ready();
    Webflow.require("ix2").init();

    // escape html and show it below.
    const escapedHtml = `<pre><code>${escapeHtml(data)}</code></pre>`;
    const escapedEl = htmlToElement(escapedHtml);
    document.querySelector(".padding-section-small").append(escapedEl);
  } catch (e) {
    console.log("error getting html");
  }
};

document.addEventListener("DOMContentLoaded", init);
