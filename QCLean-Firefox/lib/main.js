var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

pageMod.PageMod({
    include: "*.facebook.com",
    contentScript:
        'var s = document.createElement("script");'+
        's.src = "'+data.url("kerker.js")+'";'+
        '(document.head||document.documentElement).appendChild(s);',
    contentStyleFile: data.url("remove.css"),
    contentScriptWhen: "ready"
});

