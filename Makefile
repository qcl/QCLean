chrome: QCLean-Chrome
	zip -r qclean-chrome.zip QCLean-Chrome

chromium: QCLean-Chrome chromium.patch
	cp -r QCLean-Chrome Chromium
	patch -p0 -i chromium.patch

firefox: web-ext

opera: web-ext

web-ext: Web-Extension
	cd Web-Extension; zip -r web-extension.zip *; mv web-extension.zip ../

clean:
	rm -f qclean-chrome.zip
	rm -f web-extension.zip
	rm -rf Chromium

