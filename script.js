document.getElementById("Hound").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractLinks
  });

  const { js_files, links , params } = results[0].result

  let paramItems = document.getElementById("param-items")
  let paramBadge = document.getElementById("params-badge")

  let jsItems = document.getElementById("js-items")
  let jsBadge = document.getElementById("js-badge")
  
  let linkItems = document.getElementById("link-items")
  let linkBadge = document.getElementById("links-badge")

  


  paramItems.innerHTML = ""
  jsItems.innerHTML = ""
  linkItems.innerHTML = ""

  paramBadge.textContent = params.length
  jsBadge.textContent = js_files.length
  linkBadge.textContent = links.length

  if (params.length > 0) document.querySelector(".copy-button.param").style.display = "block" 
  if (js_files.length > 0) document.querySelector(".copy-button.js").style.display = "block" 
  if (links.length > 0) document.querySelector(".copy-button.link").style.display = "block" 

  for (js of js_files){
    jsItems.innerHTML += `
        <li>${js}</li>
    `
  }
  for (link of links){
    linkItems.innerHTML += `
        <li>${link}</li>
    `
  }

  for (param of params){
    paramItems.innerHTML += `
        <li>${param}</li>
    `
  }

});


function extractLinks(){
    links = [];
    js_files = [];
    params = []
    
    document.querySelectorAll("[src]").forEach((el) => {
        let link = el.src
        if (typeof link === "string") {
            if (!links.includes(link)) links.push(link)
        } 
        
    });

    document.querySelectorAll("[href]").forEach((el) => {
        let link = el.href
        if (typeof link === "string") {
            if (!links.includes(link)) links.push(link)
        } 
        
    });
    
    document.querySelectorAll("[action]").forEach((el) => {
        let link = el.action
        if (typeof link === "string") {
            if (!links.includes(link)) links.push(link)
        } 
        
    });
    
    document.querySelectorAll("[name]").forEach((el) => {
        let param = el.name
        if (typeof param === "string"){
            if (!params.includes(param)) params.push(param)
        }
    })


    for (let link of links){ // extract js file from links array
        if (link.endsWith(".js") && !js_files.includes(link)){
            js_files.push(link)
        }
    }

    links = links.filter(link => !js_files.includes(link)); // removing js links from links array

    links.sort((a, b) => a.length - b.length);
    js_files.sort((a, b) => a.length - b.length);
    params.sort((a, b) => a.length - b.length);
    
    return {
        links,
        js_files,
        params
    };

}

document.querySelectorAll(".copy-button").forEach(function(btn) {
  btn.addEventListener("click", function() {

    let keywords = this.parentElement
      .querySelector(".list")
      .textContent
      .trim()
      .split(/\n+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    let words = keywords.join("\n"); // 👈 تمیزتر از replaceAll

    navigator.clipboard.writeText(words);
  });
});
