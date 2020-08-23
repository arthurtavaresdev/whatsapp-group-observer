const assertString = require("./assertString");

module.exports = function (str) {
    const notBase64 = /[^A-Z0-9+\/=]/i;
    assertString(str);

    const len = str.length;
    if (!len || len % 4 !== 0 || notBase64.test(str)) {
        return false;
    }
    const firstPaddingChar = str.indexOf("=");
    return (
        firstPaddingChar === -1 ||
        firstPaddingChar === len - 1 ||
        (firstPaddingChar === len - 2 && str[len - 1] === "=")
    );
};
