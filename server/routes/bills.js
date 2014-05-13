// Bill routes

'use strict';

var BillModel = require('../models/bill').model;
var BillCollection = require('../models/bill').collection;
var PaymentModel = require('../models/payment').model;
var PaymentCollection = require('../models/payment').collection;

var bills = function(app) {

  //Get all bills in apartment information
  app.get('/bills', function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;

    new BillCollection({apartment_id: apartmentId})
      .fetch()
      .then(function(model) {
        var bills = [];
        for(var i = 0; i < model.length; i++) {
          var bill = model.models[i].attributes;
          var payments = [];

          // get all the payments for each bill
          new PaymentCollection({bill_id: bill.id})
            .fetch()
            .then(function(payModel) {
              for(var j = 0; j < payModel.length; j++) {
                var payment = payModel.models[j].attributes;
                payments.push({
                  user_id: payment.user_id,
                  amount: payment.amount,
                  paid: payment.paid
                });
              }
            }).otherwise(function() {
              res.json(503, {error: 'Database error.'});
            });
          bills.push({
            id: bill.id,
            name: bill.name,
            date: bill.duedate,
            freq: bill.interval,
            resolved: bill.paid,
            creator_id: bill.user_id,
            payments: payments
          });
        }
        res.json({bills: bills});
      }).otherwise(function() {
        res.json(503, {error: 'Database error.'});
      });       
  });

  //Get the details of selected bill information
  app.get('/bills/:bill', function(req, res) {
    res.end();
  });

  // Create a new bill
  app.post('/bills', function(req, res) {
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var userId = req.user.attributes.id;
    var name = req.body.name;
    var total = req.body.total;
    var interval = req.body.interval;
    var duedate = req.body.date;
    var roommates = req.body.roommates;
    var date = new Date();
    var createdate = (date.getMonth() + 1) + '/' + date.getDate() +
      '/' + date.getFullYear();

    if (!isValidName(name)) {
      res.json(400, {error: 'Invalid bill name.'});
      return;
    } else if (total < 0) {
      res.json(400, {error: 'Invalid bill total.'});
      return;
    } else if (interval < 0) {
      res.json(400, {error: 'Invalid bill interval.'});
      return;
    }

    new BillModel({apartment_id: apartmentId, name: name,
      user_id: userId, amount: total, paid: false, 
      interval: interval, duedate: duedate, createdate: createdate})
      .save()
      .then(function(model) {
        for(var i = 0; i < roommates.length; i++) {
          // add payment models for each of the payments for the bill
          new PaymentModel({paid: false, amount: roommates[i].amount,
            user_id: roommates[i].id, bill_id: model.id})
            .save()
            .then(function(model) { })
            .otherwise(function(error) {
              res.json(503, {error: error});
            });
        }
        res.json({result: 'success'});
      }).otherwise(function(error) {
        res.json(503, {error: error});
      });
  });

  // Process edit bill form, modify database
  app.put('/bills/:bill', function(req, res) {
    res.end();
  });

  app.delete('/bills/:bill', function(req, res) {
    res.end();
  });
 
  // Checks if a bill name is valid
  function isValidName(name) {
    return name !== undefined && name !== null && name !== '';
  }

};

module.exports = bills;
