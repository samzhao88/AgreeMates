// Bill routes

'use strict';

var BillModel = require('../models/bill').model;
var BillCollection = require('../models/bill').collection;
var UserModel = require('../models/user').model;
var PaymentModel = require('../models/payment').model;
var PaymentCollection = require('../models/payment').collection;
var Bookshelf = require('bookshelf');

var bills = function(app) {

  //Get all bills in apartment information
  app.get('/bills', function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }
    if(req.query.type === undefined || (req.query.type !== 'resolved' &&
       req.query.type !== 'unresolved')) {
      res.json(400, {error: 'Unexpected type parameter.'});
    }
    var apartmentId = req.user.attributes.apartment_id;

    // Fetch all the apartments bills and their corresponding
    // payments
    Bookshelf.DB.knex('bills')
      .join('payments', 'bills.id', '=', 'payments.bill_id')
      .join('users', 'payments.user_id', '=', 'users.id')
      .where('bills.apartment_id', '=', apartmentId)
      .where('bills.paid', '=', (req.query.type === 'resolved'))
      .select('bills.amount as total', 'payments.user_id', 
              'bills.paid as billPaid', 'payments.paid as userPaid',
              'bills.createdate', 'bills.duedate', 'bills.name',
              'bills.interval', 'users.first_name', 'users.id',
              'payments.bill_id', 'payments.amount')
      .orderBy('payments.bill_id')
      .then(function(rows) {
        var bills = [];
        var payments = [];
        if(rows.length === 0) {
          res.json({bills: bills});
          return;
        }

        // set lastBillId to invalid Id so algorithm will work
        var lastBillId = -1;
        var name, amount, createDate, dueDate;
        var frequency, resolved, creatorId, payTo;
        for(var i = 0; i < rows.length; i++) {

          // If billid is different, then all payments for the current
          // bill have been pushed on payments. We push the bill then
          if(rows[i].bill_id !== lastBillId) {
            if(lastBillId !== -1) {
              bills.push({
                id: lastBillId,
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
            }
            // empty payments since bill is done and set all fields for the
            // new bill
            payments = [];
            lastBillId = rows[i].bill_id;
            name = rows[i].name;
            amount = rows[i].total;
            createDate = rows[i].createdate;
            if(rows[i].id === rows[i].user_id) {
              payTo = rows[i].first_name;
            }
            dueDate = rows[i].duedate;
            resolved = rows[i].billPaid;
            frequency = rows[i].interval;
            creatorId = rows[i].id;
          }
          payments.push({
            userId: rows[i].user_id,
            name: rows[i].first_name,
            amount: rows[i].amount,
            paid: rows[i].userPaid
          });
        }
        // Push the last bill onto the bills array
        bills.push({
              id: lastBillId,
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
        res.json({bills: bills});
      })
      .otherwise(function(error) {
        console.log(error);
        res.json(503, {error: 'Database error.'});
      });
  });

  // Get the details of selected bill information
  app.get('/bills/?type=', function(req, res) {
    console.log(req.params);
  });

  // Create a new bill
  app.post('/bills', function(req, res) {

    // Check that user is authorized
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    // Copy over fields from request
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

    // Check if user is authorized
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    // Copy over fields from the request
    var apartmentId = req.user.attributes.apartment_id;
    var billId = req.params.bill;
    var name = req.body.name;
    var total = req.body.total;
    var interval = req.body.interval;
    var date = req.body.date;
    var paid = req.body.paid;
    var roommates = JSON.parse(req.body.roommates);

    // Check for validity of fields
    if (!isValidId(billId)) {
      res.json(400, {error: 'Invalid bill ID.'});
      return;
    } else if (!isValidName(name)) {
      res.json(400, {error: 'Invalid bill name.'});
      return;
    } 

    // Destroy all the payments which are references to the billId
    // This must be done since the roommates paying on a bill could be
    // different.
    new PaymentModel()
      .query('where', 'bill_id', '=', billId)
      .destroy()
      .then(function() {
        // Edit the bill
        new BillModel({id: billId, apartment_id: apartmentId})
          .save({name: name, amount: total, duedate: date, 
                paid: paid, interval: interval})
          .then(function() {
            // Add new payments for all the users who need to pay
            for(var i = 0; i < roommates.length; i++) {
              new PaymentModel({paid: roommates[i].paid, 
                               amount: roommates[i].amount,
                               user_id: roommates[i].id, bill_id: billId})
                .save()
                .otherwise(function(error) {
                  res.json(503, {error: error});
                });
            }
            res.json({result: 'success'});
          }).otherwise(function(error) {
            res.json(503, {error: error});
          });
      }).otherwise(function(error) {
        res.json(503, {error: error});
      });
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
