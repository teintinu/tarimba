load("init.js");
load("pages/WelcomePage.js");

testOnAllDevices("Bem vindo", "/", function (driver, device) {
    new WelcomePage(driver).waitForIt();
    checkLayout(driver, "../specs/welcomePage.spec", device.tags);
});
