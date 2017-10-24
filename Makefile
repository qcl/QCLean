chrome: QCLean-Chrome
	zip -r qclean-chrome.zip QCLean-Chrome

chromium: QCLean-Chrome chromium.patch
	cp -r QCLean-Chrome Chromium
	patch -p0 -i chromium.patch

firefox: web-ext

web-ext: Web-Extension
	cd Web-Extension; zip -r web-extension.zip *; mv web-extension.zip ../

opera-linux: QCLean-Opera-12
	cd QCLean-Opera-12; zip -r qclean-opera-linux.oex *; mv qclean-opera-linux.oex ../

opera: QCLean-Opera-15+
	cd QCLean-Opera-15+; zip -r qclean-opera.crx *; mv qclean-opera.crx ../

ie: QCLean-IE.js
	cp QCLean-IE.js ~/Dropbox/Public/ie.js

clean:
	rm -f qclean-chrome.zip
	rm -f qclean-opera-linux.oex
	rm -f qclean-opera.crx
	rm -f web-extension.zip
	rm -rf Chromium

