/*
*/

var qclean_version = "0.2.5.0";

var qclean_fb_url_regexp = new RegExp("^(http://|https://).*\.facebook\.com/");

if(qclean_fb_url_regexp.test(document.URL)){
    console.log("Load QCLean IE version.");

}

