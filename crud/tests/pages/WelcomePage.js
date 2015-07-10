importClass(org.openqa.selenium.interactions.Actions);

this.WelcomePage = function (driver) {
    GalenPages.extendPage(this, driver, {
        loginButton: "#welcome-page .button-login"
    });
};
