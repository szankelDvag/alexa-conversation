'use strict';

const _ = require('underscore');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function buildSlots(slots) {
    var res = {};
    _.each(slots, function (value, key) {
        if (_.isString(value)) {
            res[key] = {
                name: key,
                value: value
            };
        } else {
            res[key] = _extends({}, value, {
                name: key
            });
        }
    });
    return res;
}

function buildSession(e) {
    return e ? e.sessionAttributes : {};
}

function init(options) {
    var isNew = true;

    // public API

    var api = {
        init: init,
        build: build
    };

    function build(intentName, slots, prevEvent) {
        if (!options.appId) throw String('AppId not specified. Please run events.init(appId) before building a Request');
        var res = { // override more stuff later as we need
            session: {
                sessionId: options.sessionId,
                application: {
                    applicationId: options.appId
                },
                attributes: buildSession(prevEvent),
                user: {
                    userId: options.userId,
                    accessToken: options.accessToken
                },
                new: isNew
            },
            request: {
                type: 'IntentRequest',
                requestId: options.requestId,
                locale: options.locale,
                timestamp: new Date().toISOString(),
                intent: {
                    name: intentName,
                    slots: buildSlots(slots)
                }
            },
            version: '1.0'
        };
        isNew = false;
        return res;
    }

    return api;
}

module.exports = {init};
