this.TypeInput = function (driver) {
    GalenPages.extendPage(this, driver, {
        input: "input[name='name']",
        btn: "#btn",
        typeText: function (text) {
            this.input.typeText(text);
            this.btn.click();
        }
    });
};

var loginPage = new TypeInput(driver);
loginPage.typeText("teste de campo");
