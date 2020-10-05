const userAuth = require("../controllers/functions/UserAuth");

describe("userAuth Functions", () =>{
    describe("Exists Method", () => {
        it("Should return true if given a non-null, non-undefined value", () => {
            const information = "Information!";
            expect(userAuth.exists(information)).toEqual(true);
        });
        it("Should return false if given a null value", () => {
            const badInformation = null;
            expect(userAuth.exists(badInformation)).toEqual(false);
        });
        it("Should return false if given an undefined value", () => {
            const badInformation = undefined;
            expect(userAuth.exists(badInformation)).toEqual(false);
        });
    });
});