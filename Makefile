chrome: QCLean-Chrome
	zip -r qclean-chrome.zip QCLean-Chrome

firefox: QCLean-Firefox firefox-sdk
	cd firefox-sdk; . bin/activate; cd ../QCLean-Firefox/; cfx xpi; mv qclean-remove-facebook-ads-suggested-pages-and-posts.xpi ../qclean-firefox.xpi

firefox-sdk:
	wget https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip
	unzip jetpack-sdk-latest.zip
	rm jetpack-sdk-latest.zip

opera-linux: QCLean-Opera-12
	cd QCLean-Opera-12; zip qclean-opera-linux.oex *; mv qclean-opera-linux.oex ../

opera: QCLean-Opera-15+
	cd QCLean-Opera-15+; zip -r qclean-opera.crx *; mv qclean-opera.crx ../

ie: QCLean-IE.js
	cp QCLean-IE.js ~/Dropbox/Public/ie.js

clean:
	rm -f qclean-chrome.zip
	rm -f jetpack-sdk-latest.zip
	rm -f qclean-fiefox.xpi
	rm -f qclean-opera-linux.oex
	rm -f qclean-opera.crx

