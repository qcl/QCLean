// ==UserScript==
// @include http://*.facebook.com/*
// @include https://*.facebook.com/*
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function() {
  
	//console.log("InjectedScript!");

	var fileObj = opera.extension.getFile('/script/kerker.js');

	if(fileObj){
		var fr = new FileReader();
		fr.onload = function(){
			var kerkerScript = document.createElement("script");
			kerkerScript.textContent = fr.result;
			(document.head||document.documentElement).appendChild(kerkerScript);
		}
		fr.readAsText(fileObj);
	}

}, false);





