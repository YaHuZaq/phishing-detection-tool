const handleShowNav = () =>{
   document.getElementById("nav-id").style.display = "flex";
   document.getElementById("ham").style.display = "none";
   document.getElementById("can").style.display = "flex";
}


const handleHideNav = () =>{
   document.getElementById("nav-id").style.display = "none";
   document.getElementById("ham").style.display = "flex";
   document.getElementById("can").style.display = "none";
}

function handleURL(){
  const inputField = document.getElementById("link-input");
  const input = inputField.value.trim();
  
  if(!input){
    alert("please put something")
  }

  let riskScore = 0;
  let reasons = [];
  let url;

  try {
    url = new URL(input.startsWith("http") ? input : "http://" + input)
  } catch (error) {
    inputField.value = "";
    return
  }

  const hostname = url.hostname;
  const fullURL = url.href.toLowerCase();

  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if(ipPattern.test(hostname)){
    riskScore +=3;
    reasons.push("Uses IPAddress instead of Domain");
  }

if(url.protocol != "https:"){
  riskScore +=1;
   reasons.push("Not using HTTPS");
}

const suspeciousWords = ["secure","win","free","login","verify",
  "account","banking","free","bonus","confirm"
];
 suspeciousWords.forEach(word =>{
  if(fullURL.includes(word)){
    riskScore +=1;
    reasons.push(`Contain suspecious word: ${word}`);    
  }
 });

// http://www.instagram.com//proflie/rest/user/name/informatiom/auto//ne/valuable
// http://www.instagram.com//proflie/rest/user/name/informatiom/auto//ne/valuable

 if(fullURL.length > 75){
  riskScore+=1;
  reasons.push("URL is unusually long");
 };

 const subdomainParts = hostname.split(".");
 if(subdomainParts.length > 3){
  riskScore +=2;
  reasons.push("Too many subdomains");
 };


 if(fullURL.includes('@')){
  riskScore +=2;
  reasons.push("Contains @ symbol");
 }

   const checkIndex = fullURL.indexOf("//", 7) !== -1;
   console.log(checkIndex)
   
 if(fullURL.includes("//") && checkIndex){
  riskScore+=1;
  reasons.push("Suspecious Double slash redirect");
 };

 const suspeciousTLDs = ["xyz","gq","top","mk","tk","club","cf","live"];
 const tld = hostname.split(".").pop();
 if(suspeciousTLDs.includes(tld)){
  riskScore+=2;
  reasons.push(`Suspecious TLD ${tld}`);
 };
let riskLevel = "";
if(riskScore >= 7){
  riskLevel = "critical";
} else if(riskScore >= 5){
  riskLevel = "high";
} else if(riskScore >= 2){
  riskLevel = "medium";
} else{
  riskLevel = "low"
}

alert(`${riskLevel} and ${riskScore}`)
resultAdder(fullURL,riskLevel,reasons,riskScore);
inputField.value = "";

}

function resultAdder(url,riskLevel,reasons=[],score=0){
  const resultBox = document.getElementById("result-container");
  const box = document.createElement("div");
  box.classList.add("colors-red")

  let content = `
    <p>Your URL: ${url}</p>
  `;
  if(riskLevel === "critical") {
    content += `<p>Critical Risk</p>`;
    box.classList.add("colors-red","all")
  }else if(riskLevel === "high"){
    content += `<p>High Risk</p>`;
    box.classList.add("colors-yellow","all")
  }else if(riskLevel === "medium"){
    content += `<p>Medium Risk</p>`;
    box.classList.add("colors-warm","all")
  }else{
    content += `<p>Low Risk</p>`;
    box.classList.add("colors-green","all")
  }

  if(reasons.length){
    content += `<p>Risk Score: ${score}</p><ul>${reasons.map(r => `<li>${r}</li>`).join("")}</ul>`;
  }

  box.innerHTML = content;
  resultBox.appendChild(box);
}

if("serviceWorker" in navigator){
  window.addEventListener("load", () =>{
    navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service worker registered")
    .catch((err) => console.log("Service worker registration failed: ", err)
    )
    )
  })
}