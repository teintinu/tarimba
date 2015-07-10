test("home page test", function () {
    var driver = createDriver("http://testapp.galenframework.com/#", "1024x768");
    checkLayout(driver, "../spec/welcomePage.spec", "desktop");
    driver.quit();
});

var devices = {
    mobile: {
        size: "400x700",
        deviceName: "mobile"
    },
    tablet: {
        size: "700x500",
        deviceName: "tablet"
    },
    desktop: {
        size: "1024x768",
        deviceName: "desktop"
    }
};

forAll(devices, function () {
    test("Pagina de teste on ${deviceName} on ${size} size", function (device) {});
});
