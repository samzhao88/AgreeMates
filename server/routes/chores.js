// Chore routes

'use strict';
var choreModel = require('../models/chore').model;
var choreCollection = require('../models/chore').collection;

var chores = function(app) {

  //Get all chores for an apartment
  app.get('/chores', function(req, res) {
    res.json({chores: [{name: "dishes", interval: 7, users: [{"alice", "bob"] }], {name: "garbage", interval: 1, users: "bob"}] });

    var apartmentId = req.user.attributes.apartment_id;

    new choreCollection({apartment_id: apartmentId}).fetch().then(function(model) {
    var chores = [];

    for(var i = 0; i < model.length; i++){
        var chore = model.models[i].attributes;

        chores.push({
            id: chore.id,
            name: chore.name,
            createdate: chore.createdate,
            duedate: chore.duedate,
            interval: chore.interval,
            completed: chore.completed,
            reocurring_id: chore.reocurring_id,
            user_id: chore.user_id,
            apartment_id: chore.apartment_id
        });
    }

    res.json({chores: chores});
    }).otherwise(function(){
        res.json(503,{error: 'Database error.'});
    });
  });

  // Process chore form and adds to database
  app.post('/chores', function(req, res) {
  console.log(req.body);
  
  //console.log(req);

  var input = req.body;
  
  if(!(input)){
    input = {};
    input.name = req.body.name;
    input.duedate = req.body.duedate;
    input.interval = req.body.interval;
    input.user_id = req.user.attributes.id;
  }
  var apartmentId = req.user.attributes.apartment_id;
  var createDate = new Date;
  
  if(!isValidName(input.name)){
    res.json(400, {error: 'Invalid chore name.'});
    return;
  }
  
  console.log(req.body);
    new choreModel({apartment_id: apartmentId,
                name: input.name,
                duedate: input.name,
                createdate: createDate,
                user_id: input.user_id,
                interval: input.interval,
                })
                .save()
                .then(function(model){
                var chore = model.attributes;
                res.json(chore);
                }).otherwise(function(){
                res.json(503,{error: 'Database error.'});
            });
  });

  // Get the chore information
  app.get('/chores/:chore', function(req, res) {
    
    // var apartmentId = req.user.attributes.apartment_id;
    // var choreId = req.params.chore;
    // if (!isValidId(choreId)) {
    //   res.json(400, {error: 'Invalid supply ID.'});
    //   return;
    // }

    // new choreModel({apartment_id: apartmentId, id: choreId})
    //     .fetch().then(function(model){
    //         var chore = model.attributes;
    //         res.json(chore);
    //     }).otherwise(function(){
    //         res.json(503,{error: 'Database error.'});
    //     });
  });

  // Update the chore
  app.put('/chores/:chore', function(req, res) {
    var apartmentId = req.user.attributes.apartment_id;
    var choreId = req.params.chore;
    var name = req.body.name;
    //var dueDate: req.body.date;
  });

  // Remove chore from database
  app.delete('/chores/:chore', function(req, res) {
    var apartmentId = req.user.attributes.apartment_id;

    var input  = JSON.parse(req.body);

    console.log(req);

    if(!(input)){
        var input = {};
        input.id = req.params.id;
    }

    if (!isValidId(input.id)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }

    new choreModel({id: input.id, apartment_id: apartmentId})
        .destry()
        .then(function(){
            res.send(200);
        }).otherwise(function() {
            res.json(503, {error: 'Database error.'});
        });
  });
  
  //Checks if a chore name is valid
  function isValidName(name) {
    return name !== undefined && name !== null && name !== '';
  }

  // Checks if a chore ID is valid
  function isValidId(id) {
    return isInt(id) && id > 0;
  }
  
  function isInt(value) {
    /* jshint eqeqeq: false */
    return !isNaN(value) && parseInt(value) == value;
  }
};

module.exports = chores;
