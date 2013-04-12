$(function(){

    console.log("YO!");

    noty({text:'QCLean: Remove Facebook Ads, Suggested Posts & Pages Chrome extension is now available on Chrome Web Store, please go to Chrome Web Store download the new version then go to chrome://extensions remove the old version, thanks.<br/>「QCLean: 臉書廣告、建議專頁與建議貼文移除器」已經可以從Chrome Web Store下載了，請至Chrome Web Store下載新版本並至chrome://extensions移除舊版本。感謝！',type:'warning',buttons:[{addClass: 'btn btn-primary', text:'OK',onClick:function($noty){ 

        document.location = "https://chrome.google.com/webstore/detail/qclean-remove-facebook-ad/fdhhejjkjfjkchkimomgfegnpapndjne";
    
    }}]});

});

