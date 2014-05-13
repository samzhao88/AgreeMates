// Bill routes

'use strict';

var BillModel = require('../models/bill').model;
var BillCollection = require('../models/bill').collection;
var UserModel = require('../models/user').model;
var PaymentModel = require('../models/payment').model;
var PaymentCollection = require('../models/payment').collection;
var async = require("async");

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
        async.each(model.models, function(bill, callback) {
          var id = bill.attributes.id;
          var name = bill.attributes.name;
          var amount = bill.attributes.amount;
          var createDate = bill.attributes.createdate;
          var dueDate = bill.attributes.duedate;
          var frequency = bill.attributes.interval;
          var resolved = bill.attributes.paid;
          var creatorId = bill.attributes.user_id;
          var payTo = bill.attributes.user_id;

          new PaymentCollection()
            .query('where', 'bill_id', '=', id)
            .fetch()
            .then(function(model) {
              var payments = [];

              for (var i = 0; i < model.length; i++) {
                var payment = model.models[i].attributes;
                payments.push({
                  userId: payment.user_id,
                  amount: payment.amount,
                  paid: payment.paid
                });
              }
              bills.push({
                id: id,
                name: name,
                amount: amount,
                createDate: createDate,
                dueDate: dueDate,
                frequency: frequency,
                resolved: resolved,
                creatorId: creatorId,
                payTo: payTo,
                payments: payments
              });
              callback();
            })
            .otherwise(function(error) {
              callback('Database error.');
            });
        }, function(error) {
          if (error) {
            res.json(503, {error: error});
          } else {
            res.json({bills: bills});
          }
        });
      })
      .otherwise(function(error) {
        res.json(503, {error: 'Database error'});
      });    
  });

  // Get the details of selected bill information
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
    var date = new Date();
    var createdate = (date.getMonth() + 1) + '/' + date.getDate() +
      '/' + date.getFullYear();
    var roommates = JSON.parse(req.body.roommates);

    // Check if the fields are acceptable
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

    // Create a new bill model
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
  });

  app.delete('/bills/:bill', function(req, res) {
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }
 
    var apartmentId = req.user.attributes.apartment_id;
    var billId = req.params.bill;
 
    if(!isValidId(billId)) {
      res.json(400, {error: 'Invalid bill ID.'});
      return;
    }
 
    // Destroy all the payments for a bill and then destroy
    // the bill.
    new PaymentModel()
      .query('where', 'bill_id', '=', billId)
      .destroy()
      .then(function(payModel) { 
        new BillModel()
          .query('where', 'id', '=',  billId, 'AND', 
                 'apartment_id', '=', apartmentId)
          .destroy()
          .then(function(model) {
            res.json(200);
          }).otherwise(function(error) {
            res.json(503, {error: 'Delete payment error'})
          }); 
      }).otherwise(function(error) {
        console.log(error);
        res.json(503, {error: error});
      });
    
  });
 
  // Checks if a bill ID is valid
  function isValidId(id) {
    return isInt(id) && id > 0;
  }
 
  // Checks if a value is an integer
  function isInt(value) {
    return !isNaN(value) && parseInt(value) == value;
  }
 
  // Checks if a bill name is valid
  function isValidName(name) {
    return name !== undefined && name !== null && name !== '';
  }

};

module.exports = bills;
