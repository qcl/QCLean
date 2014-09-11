// ==UserScript==
// @include http://*.facebook.com/*
// @include https://*.facebook.com/*
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function() {
  
	//console.log("InjectedScript!");

	var fileObj = opera.extension.getFile('/script/qclean.js');

	if(fileObj){
		var fr = new FileReader();
		fr.onload = function(){
			var qcleanScript = document.createElement("script");
			qcleanScript.textContent = fr.result;
			(document.head||document.documentElement).appendChild(qcleanScript);
		}
		fr.readAsText(fileObj);
	}

}, false);





