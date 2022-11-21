declare var Webflow: any;

const htmlToElement = (el) => {
  const template = document.createElement("template");
  //htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
  //template.innerHTML = htmlString;
  setInnerHTML(template, html);
  return template.content.firstChild;
};

const setInnerHTML = (elm, html) => {
  console.log({ html });
  elm.innerHTML = html;
  console.log({ elm });
  Array.from(elm.querySelectorAll("script")).forEach((oldScriptEl) => {
    console.log("script");
    const newScriptEl = document.createElement("script");

    Array.from(oldScriptEl.attributes).forEach((attr) => {
      newScriptEl.setAttribute(attr.name, attr.value);
    });

    const scriptText = document.createTextNode(oldScriptEl.innerHTML);
    newScriptEl.appendChild(scriptText);

    oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
};

const addHeadScript = (src) => {
  console.log("addHeadScript");
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  head.appendChild(script);
};

const evaluateCode = (elm) => {
  elm.querySelectorAll("script").forEach((scriptTag, index) => {
    //console.log(scriptTag.innerHTML)
    console.log(`starting run ${index}`);
    if (scriptTag.src !== "") {
      console.log("scriptTab with src: ", scriptTag);
      addHeadScript(scriptTag.src);
    } else {
      eval(scriptTag.innerHTML);
    }

    console.log(`finished run ${index}`);
  });
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
  const slug = document.querySelector('[wb-data="slug"]')?.textContent;
  const category = document.querySelector('[wb-data="category"]')?.textContent;
  if (slug === "" || category == "") return;
  let url = `https://raw.githubusercontent.com/learyjk/component-library/main/${category}/${slug}.html`;

  try {
    const response = await fetch(url);
    console.log({ response });
    const data = await response.text();
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(data, "text/html");
    if (!parsedHTML) return;
    //console.log({ parsedHTML });

    const elToAdd = parsedHTML.querySelector("body")?.firstChild as HTMLDivElement;
    if (!elToAdd) return
    console.log({ elToAdd });
    document.querySelector('[wb-data="preview-wrapper"]')?.append(elToAdd)
    const scriptTags = elToAdd.querySelectorAll('script')
    console.log(scriptTags)
    let scriptsExternal: Array<HTMLScriptElement> = [];
    let scriptsInline: Array<HTMLScriptElement> = [];
    scriptTags.forEach((scriptTag) => {
      if (scriptTag.src !== "") {
        scriptsExternal.push(scriptTag)
      } else {
        scriptsInline.push(scriptTag);
      }
    })
    console.log({ scriptsExternal })
    console.log({ scriptsInline })
    scriptsExternal.forEach((scriptExt) => {
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.onload = function () {
          // remote script has loaded
          console.log('remote script has loaded')
        };
        js.async = true;
        js.src = scriptExt.src;
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'wb'));
    })
    window.addEventListener('load', () => {
      console.log('window load event')
      scriptsInline.forEach((scriptIn) => {

        eval(scriptIn.innerHTML)
      })
    })

    // Add preview to page
    // if (category !== "navbar") {
    //   //let preview = htmlToElement(parsedHTML.querySelector('body').firstChild);

    //   document
    //     .querySelector('[wb-data="preview-wrapper"]')
    //     .append(parsedHTML.querySelector("body").firstChild);
    //   evaluateCode(document.querySelector('[wb-data="preview-wrapper"]'));
    //   console.log("done appending");
    // }

    // escape html and show it below.
    // const escapedHtml = `<pre><code>${escapeHtml(data)}</code></pre>`;
    // const escapedEl = htmlToElement(escapedHtml);
    // document.querySelector('[wb-data="html-display"]').append(escapedEl);
    // hljs.highlightAll();
  } catch (e) {
    console.log("error getting html");
  } finally {
    Webflow.destroy();
    Webflow.ready();
    Webflow.require("ix2").init();
  }
};

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
});

addGlobalEventListener("click", '[wb-data="copy-button"]', async (e) => {
  const copyButton = e.target.closest('[wb-data="copy-button"]');
  const buttonText = copyButton.querySelector('[wb-data="text"]');
  const spinner = copyButton.querySelector('[wb-data="spinner"]');
  const category = copyButton
    .querySelector('[wb-data="category"]')
    .textContent.toLowerCase();
  const slug = copyButton
    .querySelector('[wb-data="slug"]')
    .textContent.toLowerCase();

  let wfJson = {};
  buttonText.textContent = "Copying...";
  spinner.style.display = "block";
  // url
  const url = `https://raw.githubusercontent.com/learyjk/component-library/main/${category}/${slug}.json`;

  const copyButtonClicked = (event) => {
    event.clipboardData.setData("application/json", JSON.stringify(wfJson));
    event.preventDefault();
  };

  try {
    const response = await fetch(url);
    const data = await response.text();
    wfJson = JSON.parse(data);
    document.addEventListener("copy", copyButtonClicked);
    document.execCommand("copy");
  } catch (e) {
    console.error("error copying component");
  } finally {
    document.removeEventListener("copy", copyButtonClicked);
    setTimeout(() => {
      buttonText.textContent = "Copy to Webflow";
      spinner.style.display = "none";
    }, 1000);
  }
});

function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.closest(selector)) {
      callback(e);
    }
  });
}
