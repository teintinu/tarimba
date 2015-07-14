this.HomePage = function (driver) {
    GalenPages.extendPage(this, driver, {
        loginButton: "button",
    });
};

var homePage = new HomePage(driver);
homePage.loginButton.click();
