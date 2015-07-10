load("init.js");
load("pages/LoginPage.js");

testOnDevice(devices.desktop, "Fazendo login", "/", function (driver, device) {
    var loginPage = null;

    logged("Basic layout check", function () {
        var welcomePage = new WelcomePage(driver).waitForIt();
        welcomePage.loginButton.click();
        loginPage = new LoginPage(driver).waitForIt();

        checkLayout(driver, "../specs/loginPage.spec", device.tags);
    });

    logged("Login", function () {
        loginPage.username.typeText(TEST_USER.username);
        loginPage.password.typeText(TEST_USER.password);
        loginPage.loginButton.click();
        checkLayout(driver, "../specs/loginPage.spec", device.tags);
    });

//
//    logged("Checking error box", function () {
//        loginPage.username.typeText("dasdasd");
//        loginPage.loginButton.click();
//        loginPage.errorMessage.waitToBeShown();
//
//        checkLayout(driver, "../specs/loginPage-withErrorMessage.spec", device.tags);
//    });
});

/*
var login = null;

logged("Teste básico", function () {
    var bem_vindo = new WelcomePage(driver).waitForIt();
    bem_vindo.click();
    login = new LoginPage(driver).waitForIt();
    checkLayout(driver, "../specs/loginPage.spec", device.tags);
});*/
