TestCollection = new Mongo.Collection('test');
OptionsCollection = new Mongo.Collection('options');
OptionsRelatedCollection = new Mongo.Collection('optionsRelated');

var options = function () {
    return OptionsCollection.find().fetch();
};


TestCollection.attachSchema(new SimpleSchema({
    single: {
        type: String,
        label: 'single',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'universe-select',
                options: options,
                uniPlaceholder: 'Please select value'
            }
        }
    },
    multiple: {
        type: [String],
        label: 'multiple',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'universe-select',
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
    },
    related1: {
        type: String,
        label: "related1",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "universe-select",
                optionsMethod: "getOptionsRelated"
            }
        }
    },
    related2: {
        type: String,
        label: "related2",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "universe-select",
                optionsMethod: "getOptionsRelated"
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
            if (label && value) {
                OptionsCollection.insert({label: label, value: value});
            }
        },
        getOptions: function (options) {
            this.unblock();
            var searchText = options.searchText;
            var values = options.values;

            Meteor.wrapAsync(function (callback) {
                Meteor.setTimeout(function () {
                    callback();
                }, 1000);
            })();

            if (searchText) {
                return OptionsCollection.find({label: {$regex: searchText}}, {limit: 5}).fetch();
            } else if (values.length) {
                return OptionsCollection.find({value: {$in: values}}).fetch();
            }
            return OptionsCollection.find({}, {limit: 5}).fetch();
        },
        getOptionsRelated: function (options) {
            this.unblock();
            var searchText = options.searchText;
            var values = options.values;
            var params = options.params;

            Meteor.wrapAsync(function (callback) {
                Meteor.setTimeout(function () {
                    callback();
                }, 1000);
            })();

            if (searchText) {
                if (params) {
                    return OptionsRelatedCollection.find({
                        label: {$regex: searchText},
                        parent: params
                    }, {limit: 5}).fetch();
                } else {
                    return OptionsRelatedCollection.find({
                        label: {$regex: searchText},
                        parent: null
                    }, {limit: 5}).fetch();
                }

            } else if (values.length) {
                if (params) {
                    return OptionsRelatedCollection.find({value: {$in: values}, parent: params}).fetch();
                } else {
                    return OptionsRelatedCollection.find({value: {$in: values}, parent: null}).fetch();
                }
            }

            if (params) {
                return OptionsRelatedCollection.find({parent: params}, {limit: 5}).fetch();
            } else {
                return OptionsRelatedCollection.find({parent: null}, {limit: 5}).fetch();
            }
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
    if (opt) {
        return false;
    }
    return true;
});

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (!OptionsRelatedCollection.find().count()) {
            OptionsRelatedCollection.insert({label: '1111', value: '1111'});
            OptionsRelatedCollection.insert({label: '2222', value: '2222'});
            OptionsRelatedCollection.insert({label: '3333', value: '3333'});
            OptionsRelatedCollection.insert({label: '1111AAAA', value: '1111AAAA', parent: '1111'});
            OptionsRelatedCollection.insert({label: '1111BBBB', value: '1111BBBB', parent: '1111'});
            OptionsRelatedCollection.insert({label: '1111CCCC', value: '1111CCCC', parent: '1111'});
            OptionsRelatedCollection.insert({label: '2222AAAA', value: '2222AAAA', parent: '2222'});
            OptionsRelatedCollection.insert({label: '2222BBBB', value: '2222BBBB', parent: '2222'});
            OptionsRelatedCollection.insert({label: '2222CCCC', value: '2222CCCC', parent: '2222'});
            OptionsRelatedCollection.insert({label: '3333test', value: '3333test', parent: '3333'});
        }
    });
}
