const htmlToElement = (el) => {
  const template = document.createElement("template");
  //htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
  //template.innerHTML = htmlString;
  setInnerHTML(template, html)
  return template.content.firstChild;
};

const setInnerHTML = (elm, html) => {
  console.log({ html })
  elm.innerHTML = html;
  console.log({ elm })
  Array.from(elm.querySelectorAll("script"))
    .forEach(oldScriptEl => {
      console.log('script')
      const newScriptEl = document.createElement("script");

      Array.from(oldScriptEl.attributes).forEach(attr => {
        newScriptEl.setAttribute(attr.name, attr.value)
      });

      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);


      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
    });
}

const addHeadScript = (src) => {
  console.log('addHeadScript')
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  head.appendChild(script);
}

const evaluateCode = (elm) => {
  elm.querySelectorAll('script').forEach((scriptTag, index) => {
    //console.log(scriptTag.innerHTML)
    console.log(`starting run ${index}`)
    if (scriptTag.src !== "") {
      addHeadScript(scriptTag.src)
    } else {
      eval(scriptTag.innerHTML)
    }

    console.log(`finished run ${index}`)
  })
}

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
  const slug = document.querySelector('[wb-data="slug"]').textContent
  const category = document.querySelector('[wb-data="category"]').textContent;
  let url = `https://raw.githubusercontent.com/learyjk/component-library/main/${category}/${slug}.html`;

  try {

    const response = await fetch(url);
    console.log({ response })
    const data = await response.text();
    // const parser = new DOMParser();
    // const parsedHTML = parser.parseFromString(data, 'text/html');
    // console.log({ parsedHTML })

    var frag = parsePartialHtml(data);
    fixScriptsSoTheyAreExecuted(frag);
    document.body.appendChild(frag);


    function fixScriptsSoTheyAreExecuted(el) {
      var scripts = el.querySelectorAll('script'),
        script, fixedScript, i, len;

      for (i = 0, len = scripts.length; i < len; i++) {
        script = scripts[i];

        fixedScript = document.createElement('script');
        fixedScript.type = script.type;
        if (script.innerHTML) fixedScript.innerHTML = script.innerHTML;
        else fixedScript.src = script.src;
        fixedScript.async = false;

        script.parentNode.replaceChild(fixedScript, script);
      }
    }

    function parsePartialHtml(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html'),
        frag = document.createDocumentFragment(),
        childNodes = doc.body.childNodes;

      while (childNodes.length) frag.appendChild(childNodes[0]);

      return frag;
    }

    // Add preview to page
    // if (category !== 'navbar') {
    //   //let preview = htmlToElement(parsedHTML.querySelector('body').firstChild);

    //   document.querySelector('[wb-data="preview-wrapper"]').append(parsedHTML.querySelector('body').firstChild);
    //   evaluateCode(document.querySelector('[wb-data="preview-wrapper"]'))
    //   console.log('done appending')
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
    Webflow.require('ix2').init();
  }
};

document.addEventListener("DOMContentLoaded", init);

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