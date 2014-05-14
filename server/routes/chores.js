// Chore routes

'use strict';

var ChoreModel = require('../models/chore').model;
var ChoreCollection = require('../models/chore').collection;
var UserChoreModel = require('../models/users_chores').model;
var UserChoreCollection = require('../models/users_chores').collection;
var async = require("async");

var chores = function(app) {


    //  // Create a new bill
    // app.post('/chores/supertest', function(req, res) {
    // console.log("hello");

    // var apartmentId = req.user.attributes.apartment_id;
    // var userId = req.user.attributes.id;
    // var name = req.body.name;
    // var interval = req.body.interval;
    // var duedate = req.body.date;
    // var date = new Date();
    // var createdate = (date.getMonth() + 1) + '/' + date.getDate() +
    //   '/' + date.getFullYear();

    // new ChoreModel({apartment_id: apartmentId, name: name,
    //   user_id: userId, completed: false, interval: interval, duedate: duedate, createdate: createdate})
    //   .save().then(function(model) {
    //    console.log("hello");
    //   }).otherwise(function(error) {
    //     res.json(503, {error: error});
    //   });
    // });

  
				
};

module.exports = chores;
