(()=>{var y=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var f=y((exports,module)=>{var escapeHtml=e=>{let t=/&/g,o=/</g,n=/\'/g,a=/\"/g,c=/[&<>\"\']/;return e==null?e:(typeof e!="string"&&(e=String(e)),c.test(String(e))?e.replace(t,"&amp;").replace(o,"&lt;").replace(n,"&apos;").replace(a,"&quot;"):e)},scriptsExternal=[],scriptsInline=[],init=async()=>{let slug=document.querySelector('[wb-data="slug"]')?.textContent,category=document.querySelector('[wb-data="category"]')?.textContent;if(slug===""||category=="")return;let url=`https://raw.githubusercontent.com/learyjk/component-library/main/${category}/${slug}.html`;try{let response=await fetch(url);console.log({response});let data=await response.text(),parser=new DOMParser,parsedHTML=parser.parseFromString(data,"text/html");if(!parsedHTML)return;let elToAdd=parsedHTML.querySelector("body")?.firstChild;if(!elToAdd)return;document.querySelector('[wb-data="preview-wrapper"]')?.append(elToAdd);let scriptTags=elToAdd.querySelectorAll("script");scriptTags.forEach(e=>{e.src!==""?scriptsExternal.push(e):scriptsInline.push(e)}),scriptsExternal.forEach((scriptExt,index)=>{(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];d.getElementById(id)||(js=d.createElement(s),js.id=id,js.onload=function(){index===scriptsExternal.length-1&&scriptsInline.forEach(scriptIn=>{eval(scriptIn.innerHTML)})},js.async=!0,js.src=scriptExt.src,fjs.parentNode?.insertBefore(js,fjs))})(document,"script","wb")})}catch(e){console.log("error getting html")}finally{Webflow.destroy(),Webflow.ready(),Webflow.require("ix2").init()}};document.addEventListener("DOMContentLoaded",init);window.addEventListener("load",e=>{console.log("page is fully loaded")});addGlobalEventListener("click",'[wb-data="copy-button"]',async e=>{let t=e.target.closest('[wb-data="copy-button"]'),o=t.querySelector('[wb-data="text"]'),n=t.querySelector('[wb-data="spinner"]'),a=t.querySelector('[wb-data="category"]').textContent.toLowerCase(),c=t.querySelector('[wb-data="slug"]').textContent.toLowerCase(),l={};o.textContent="Copying...",n.style.display="block";let p=`https://raw.githubusercontent.com/learyjk/component-library/main/${a}/${c}.json`,i=r=>{r.clipboardData.setData("application/json",JSON.stringify(l)),r.preventDefault()};try{let u=await(await fetch(p)).text();l=JSON.parse(u),document.addEventListener("copy",i),document.execCommand("copy")}catch{console.error("error copying component")}finally{document.removeEventListener("copy",i),setTimeout(()=>{o.textContent="Copy to Webflow",n.style.display="none"},1e3)}});function addGlobalEventListener(e,t,o){document.addEventListener(e,n=>{n.target.closest(t)&&o(n)})}});f();})();
//# sourceMappingURL=component-template-page.js.map
