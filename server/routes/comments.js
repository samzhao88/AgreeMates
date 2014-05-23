// Comments routes

'use strict';

var MessageModel = require('../models/message').model;
var CommentModel = require('../models/comment').model;
var HistoryModel = require('../models/history').model;

var comments = function(app) {

  app.post('/messages/:message/comments', function(req, res) {
    
    // Check that user is authorized
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }
    
    // Copy over fields from request
    var apartmentId = req.user.attributes.apartment_id;
    var userId = req.user.attributes.id;
    var messageId = req.params.message;
    var text = req.body.body;
    var date = new Date();

    if (!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message id.'});
      return;
    } else if (text === null) {
      res.json(400, {error: 'Comment content cannot be null.'});
      return;
    }

    new CommentModel({user_id: userId, message_id: messageId, 
                     body: text, date: date})
      .save()
      .then(function(model) {
        new MessageModel({id: messageId})
          .fetch()
          .then(function(message) {
            var historyString = req.user.attributes.first_name + ' ' +
              req.user.attributes.last_name + ' added a comment to message "' +
              message.attributes.subject.trim() + '"';
            new HistoryModel({apartment_id: apartmentId,
              history_string: historyString, date: new Date()})
              .save()
          });
        model.author = req.user.attributes.first_name;
        res.json(model);
      }).otherwise(function(error) {
        res.json(503, {error: 'Database error'});
      });
    
  });

  app.put('/messages/:message/comments/:comment', function(req, res) {
    
    // Check if user is authorized
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    // Copy over the fields
    var userId = req.user.attributes.id;
    var messageId = req.params.message;
    var commentId = req.params.comment;
    var text = req.body.text;
    var apartmentId = req.user.attributes.apartment_id;

    if(!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message id.'});
      return;
    } else if(!isValidId(commentId)) {
      res.json(400, {error: 'Invalid comment id.'});
      return;
    } else if(text === null) {
      res.json(400, {error: 'Comment body cannot be null.'});
      return;
    }

    new CommentModel({id: commentId, message_id: messageId, user_id: userId})
      .save({body: text})
      .then(function(model) {
        new MessageModel({id: messageId})
          .fetch()
          .then(function(message) {
            var historyString = req.user.attributes.first_name + ' ' +
              req.user.attributes.last_name + 
              ' edited their comment on the message  "' +
              message.attributes.subject.trim() + '"';
            new HistoryModel({apartment_id: apartmentId,
              history_string: historyString, date: new Date()})
              .save()
          });
        res.json({id: model.attributes.id});
      }).otherwise(function(error) {
        res.json(503, {error: 'Database error.'});
      });    
  });

  app.delete('/messages/:message/comments/:comment', function(req, res) {
    // Check if user is authorized
    if(req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }
 
    var userId = req.user.attributes.id;
    var messageId = req.params.message;
    var commentId = req.params.comment;
    var apartmentId = req.user.attributes.apartment_id;

    // Check if fields are valid  
    if(!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message id.'});
      return;
    } else if(!isValidId(commentId)) {
      res.json(400, {error: 'Invalid comment id.'});
      return;
    }

    new MessageModel({id: messageId})
      .fetch()
      .then(function(model) {
        var historyString = req.user.attributes.first_name + ' ' +
          req.user.attributes.last_name + 
          ' deleted their comment on the message "' +
          model.attributes.subject.trim() + '"';
        new HistoryModel({apartment_id: apartmentId,
          history_string: historyString, date: new Date()})
          .save()

        // Get the comment, make sure the user_id is the user
        // trying to delete it.
        new CommentModel()
          .query('where', 'message_id', '=', messageId, 'AND',
                 'id', '=', commentId, 'AND',
                 'user_id', '=', userId)
          .destroy()
          .then(function() {
            res.send(200);
          }).otherwise(function(error) {
            res.json(503, {error: 'Database error.'});
          });
      }).otherwise(function(error) {
        res.json(503, {error: 'Database error.'});
      });
  });

  // Checks if a value is an integer
  function isInt(value) {
    return !isNaN(value) && parseInt(value) == value;
  }

  // Checks if a bill ID is valid
  function isValidId(id) {
    return isInt(id) && id > 0;
  }
};

module.exports = comments;
