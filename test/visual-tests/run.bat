@echo off
echo Run unit tests in Chrome \(test\\visual-tests\\run.bat\)
echo \(You need to run \"gulp build-test\" before testing.\)
echo
test/visual-tests/run-helper.bat &
node test/visual-tests/server.js
