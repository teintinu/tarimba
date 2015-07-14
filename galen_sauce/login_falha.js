this.LoginPage = function (driver) {
    GalenPages.extendPage(this, driver, {
        username: "input[name='login.username']",
        password: "input[name='login.password']",
        loginButton: "button.btn-primary",
        loginAs: function (username, password) {
            this.username.typeText(username);
            this.password.typeText(password);
            this.loginButton.click();
        }
    });
};

var loginPage = new LoginPage(driver);
loginPage.loginAs("testuser@example.com", "test123x");
