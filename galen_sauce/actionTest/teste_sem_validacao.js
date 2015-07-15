this.TypeAction = function (driver) {
    GalenPages.extendPage(this, driver, {
        button: "button[name='salvar']",
        clickButton: function () {
            this.button.click();
        }
    });
};
