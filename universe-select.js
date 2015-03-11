TestCollection = new Mongo.Collection('test');
OptionsCollection = new Mongo.Collection('options');

var options = function () {
    return OptionsCollection.find().fetch();
}


TestCollection.attachSchema(new SimpleSchema({
    single: {
        type: String,
        label: "single",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "universe-select",
                options: options
            }
        }
    },
    multiple: {
        type: [String],
        label: "multiple",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "universe-select",
                options: options
            }
        }
    },
    create: {
        type: [String],
        label: "create",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "universe-select",
                options: options
            }
        }
    }
}));

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (!TestCollection.find().count()) {
            TestCollection.insert({single: 'Test1', test2: 'Test2'});
        }
    });

    Meteor.methods({
        insertOption: function (label, value) {
            OptionsCollection.insert({label: label, value: value});
        }
    });
}

if (Meteor.isClient) {
    Template.hello.helpers({
        testObject: function () {
            return TestCollection.findOne();
        }
    });
}