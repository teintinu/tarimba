load("WelcomePage.js");

this.LoginPage = function (driver) {
    GalenPages.extendPage(this, driver, {
        username: "input[name='login.username']",
        password: "input[name='login.password']",
        loginButton: "button.button-login"
    }, {
        errorMessage: "#login-error-message",

        loginAs: function (user) {
            var thisPage = this;
            logged("Login as " + user.username + " with password " + user.password, function () {
                thisPage.username.typeText(user.username);
                thisPage.password.typeText(user.password);
                thisPage.loginButton.click();
            });
        }
    });
};
