const mockingoose = require('mockingoose').default;
const user = require("../models/userModel");


describe("test mongoose UserModel", () => {

    it("should return the document with findById", () => {
        const _doc = {
            _id: '5f5eab5cb441a11880065890',
            firstname: 'bill',
            lastname: 'nye',
            email: 'nye@email.com',
            password: 'billybob123'
        };
        mockingoose(user).toReturn(_doc, 'findOne');
        return user.findById({ _id: '5f5eab5cb441a11880065890' }).then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
        });
    });

    it("should return document with update", () => {
        const _doc = {
            _id: '5f5eab5cb441a11880065890',
            firstname: 'bill',
            lastname: 'nye',
            email: 'nye@email.com',
            password: 'billybob123'
        };
        mockingoose(user).toReturn(_doc, 'update');
        return user.update({ firstname: "Susan" })
            .where({ _id: '5f5eab5cb441a11880065890' })
            .then(doc => {
                expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
            });
    });
});