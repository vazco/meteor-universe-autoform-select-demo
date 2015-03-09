TestCollection = new Mongo.Collection('test');
OptionsCollection = new Mongo.Collection('options');

var options = function () {
    return OptionsCollection.find().fetch();
}


TestCollection.attachSchema(new SimpleSchema({
    test1: {
        type: String,
        label: "Test1",
        optional: true,
        autoform: {
            afFieldInput: {
                //type: "select-multiple",
                //type: 'select2',
                type: "universe-select",
                options: options
            }
        }
    }
}));

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (!TestCollection.find().count()) {
            TestCollection.insert({test1: 'Test1', test2: 'Test2'});
        }
    });
}

if (Meteor.isClient) {
    Template.hello.helpers({
        testObject: function () {
            return TestCollection.findOne();
        },
        log: function (obj) {
            console.log('!!!! LOG', obj);
        }
    });
}