"use strict";


let firebase = require("firebase/app"),
    fb = require("./fb-getter"),
    fbData = fb();

require("../lib/node_modules/firebase/auth");
require("../lib/node_modules/firebase/database");

var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL
};


firebase.initializeApp(config);

module.exports = firebase;