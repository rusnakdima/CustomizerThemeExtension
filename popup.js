var style = document.createElement('style');
style.append(`
body{
  background-size: cover;
}

#devBlock{
  z-index: 5000 !important;
  position: fixed !important;
  top: 10px !important;
  left: 0px !important;
  background-color: transparent !important;
  border: none !important;
  font-family: Arial, sans-serif !important;
}

#toggleWind{
  background-color: white !important;
  color: black !important;
  border: 2px solid red !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  transform: translateX(-185px);
  transition: 0.2s ease-out !important;
  border-radius: 10px !important;
  font-size: 15pt !important;
  padding: 10px !important;
}

#toggleWind:hover{
  transform: none;
}

#customBlock input,
#customBlock [type=range],
#customBlock button {
  font-size: 15pt;
  background-color: transparent;
  height: auto;
  color: white;
  border: 1px solid white;
}

#customBlock [type=checkbox],
#customBlock [type=color]{
  width: 50px;
  height: 50px;
}

#customBlock {
  font-size: 15pt !important;
  width: 400px !important;
  margin: 5px !important;
  padding: 10px !important;
  display: none;
  flex-direction: column !important;
  row-gap: 5px !important;
  background-color: rgba(21,25,29,0.9) !important;
  color: white !important;
  border: 2px solid red !important;
}

#customBlock div {
  display: flex !important;
  flex-direction: row !important;
  column-gap: 10px !important;
  border-bottom: 2px solid white !important;
  align-items: center !important;
}

`)

document.querySelector('head')
.append(style);

var div = document.createElement('div');
div.id = "devBlock";
div.innerHTML = `
<button id="toggleWind">Show custom block  ></button>
<div id="customBlock">
  <div>
    <span>Link on photo for background</span>
    <input type="text" id="backImage">
  </div>
  <div>
    <span>Color back body</span>
    <input type="color" id="backBody">
  </div>
  <div>
    <span>Background image/color</span>
    <input type="checkbox" id="checkBack">
  </div>
  <div>
    <span>Color text</span>
    <input type="color" id="textCol">
  </div>
  <div>
    <span>Color back block</span>
    <input type="color" id="blockBackCol">
  </div>
  <div>
    <span>Value transparent</span>
    <input type="range" id="transpVal">
  </div>
  <div>
    <span>Color border block</span>
    <input type="color" id="borderCol">
  </div>
  <div>
    <span>Size border width</span>
    <input type="number" value="0" id="borderWidth">
  </div>
  <div>
    <span>Color back button</span>
    <input type="color" id="butBackCol">
  </div>
  <div>
    <span>Color button</span>
    <input type="color" id="butCol">
  </div>
  <button id="setBut">Set theme</button>
  <button id="reset">Reset</button>
</div>
`;

document.querySelector('body')
.append(div);

async function setTheme() {
  chrome.storage.local.get(['myTheme'], function(result) {
    if (Object.keys(result).length === 0) {
      console.log('Key does not exist in local storage.');
    } else {
      // console.log('Value currently is ' + result.myTheme);
      var obj = JSON.parse(result.myTheme);
      if (obj['setBackground'])
        document.querySelector("body").style = "background-image: " + obj['backBody'] + " !important; background-color: none !important; background-size: contain !important; background-position: center !important;";
      else
        document.querySelector("body").style = "background-color: " + obj['backBody'] + " !important; background-image: none !important;";
    
      var textAll = document.querySelectorAll("pre, span, p, i, b, s, a, sup, sub, u, li, ol, ul, input, h1, h2, h3, h4, h5, h6, ion-icon");
      textAll.forEach(text => {
        if(text.parentElement.parentElement.id != "customBlock"){
          text.style = "color: " + obj['textCol'] + " !important; background: none !important;";
        }
      });
      var blockAll = document.querySelectorAll("aside, nav, div, section, header, footer, main, form");
      blockAll.forEach(block => {
        if(block.id != "devBlock" && block.id != "customBlock" && block.parentElement.id != "customBlock"){
          block.style = "background-color: " + obj['blockBackCol'] + " !important; border-color: " + obj['borderCol'] + " !important; border-width: " + obj['borderWidth'] + " !important; color: " + obj["textCol"] + " !important;";
        }
      });
      var butAll = document.querySelectorAll("button, [type=button], .button, #button, .btn, #btn");
      butAll.forEach(but => {
        if(but.parentElement.id != "devBlock" && but.parentElement.id != "customBlock"){
          but.style = "background-color: " + obj['butBackCol'] + " !important; color: " + obj["butCol"] + " !important";
        }
      });
    
      var rgbNumbers = obj['blockBackCol'].slice(5, -1).split(",");
      rgbNumbers.pop(-1);
      const hexNumbers = rgbNumbers.map((number) => {
        const hex = parseInt(number).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      });
      const hexString = "#" + hexNumbers.join("");
      //Setting data from object properties to elements in block settings
      if(obj['backBody'].slice(0, 3) == "url")
        document.querySelector("#customBlock #backImage").value = obj['backBody'].slice(4, -1);
      else document.querySelector("#customBlock #backBody").value = obj['backBody'];
      document.querySelector("#customBlock #checkBack").checked = obj['setBackground'];
      document.querySelector("#customBlock #textCol").value = obj['textCol'];
      document.querySelector("#customBlock #blockBackCol").value = hexString;
      document.querySelector("#customBlock #transpVal").value = obj['transparent'] * 100;
      document.querySelector("#customBlock #borderCol").value = obj['borderCol'];
      document.querySelector("#customBlock #borderWidth").value = obj['borderWidth'];
      document.querySelector("#customBlock #butBackCol").value = obj['butBackCol'];
      document.querySelector("#customBlock #butCol").value = obj['butCol'];
    }
  });
}

setTimeout(() => {
  document.querySelector("#toggleWind").addEventListener("click", () => {
    if(document.querySelector("#customBlock").style.display == "flex"){
      document.querySelector("#customBlock").style.display = "none";
      document.querySelector("#toggleWind").innerHTML = "Show custom block  >";
      document.querySelector("#toggleWind").style = "";
    } else {
      document.querySelector("#customBlock").style.display = "flex";
      document.querySelector("#toggleWind").innerHTML = "Hide custom block  >";
      document.querySelector("#toggleWind").style = "transform: none;";
    }
  });
}, 500);


document.querySelector("#setBut").addEventListener("click", function () {
  var val;
  if (document.querySelector("#customBlock #checkBack").checked) {
    var link = document.querySelector("#customBlock #backImage").value;
    link = link.replaceAll("\\", "/");
    link = link.replaceAll(" ", "%20");
    val = "url(" + link + ")";
  } else {
    val = document.querySelector("#customBlock #backBody").value;
  }
  var aRgbHex = document.querySelector("#customBlock #blockBackCol").value;
  aRgbHex = aRgbHex.slice(1).match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16)
  ];
  
  var obj = {
    "backBody": val,
    "textCol": document.querySelector("#customBlock #textCol").value,
    "blockBackCol": "rgba(" + aRgb + "," + document.querySelector('#customBlock #transpVal').value / 100 + ")",
    "borderCol": document.querySelector("#customBlock #borderCol").value,
    "borderWidth": +document.querySelector("#customBlock #borderWidth").value,
    "transparent": document.querySelector('#customBlock #transpVal').value / 100,
    "butBackCol": document.querySelector("#customBlock #butBackCol").value,
    "butCol": document.querySelector("#customBlock #butCol").value,
    "setBackground": document.querySelector("#customBlock #checkBack").checked
  }
  chrome.storage.local.set({"myTheme": JSON.stringify(obj)});
  setTheme();
});

document.querySelector("#reset").addEventListener("click", function(){
  chrome.storage.local.remove("myTheme");
  window.location.reload();
});

setTheme();