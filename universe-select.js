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
    },
    remote: {
        type: [String],
        label: "remote",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "universe-select",
                optionsMethod: "getOptions"
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
        },
        getOptions: function (qry) {
            this.unblock();
            Meteor.wrapAsync(function (callback) {
                Meteor.setTimeout(function () {
                    callback();
                }, 2000);
            })();

            if(qry){
                return OptionsCollection.find({label: {$regex: qry}}, {limit: 5}).fetch();
            }
            return OptionsCollection.find({}, {limit: 5}).fetch();
        }
    });
}

if (Meteor.isClient) {
    Template.hello.helpers({
        testObject: function () {
            return TestCollection.findOne();
        },
        debug: function () {
            return false;
        }
    });
}

OptionsCollection.before.insert(function (userId, doc) {
    var opt = OptionsCollection.findOne({value: doc.value});
    if(opt){
        return false;
    }
    return true;
});