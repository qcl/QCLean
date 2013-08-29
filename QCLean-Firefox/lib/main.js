var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

pageMod.PageMod({
    include: "*.facebook.com",
    contentScriptFile: [data.url("qclean.js")],
    contentStyleFile: data.url("remove.css"),
    contentScriptWhen: "ready"
});


