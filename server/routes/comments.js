// Comments routes
// jshint camelcase: false

'use strict';

var MessageModel = require('../models/message').model;
var CommentModel = require('../models/comment').model;
var HistoryModel = require('../models/history').model;

var Comments = {

  // Sets up all routes
  setup: function(app) {
    app.post('/messages/:message/comments', Comments.addComment);
    app.delete('/messages/:message/comments/:comment', Comments.deleteComment);
  },

  // Adds a comment to a message
  addComment: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var userId = req.user.attributes.id;
    var messageId = req.params.message;
    var text = req.body.body;
    var date = new Date();

    if (!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message ID.'});
      return;
    } else if (text === undefined) {
      res.json(400, {error: 'Must have comment content'});
      return;
    }

    Comments.createComment(userId, messageId, text, date,
      function then(model) {
        Comments.getMessage(messageId,
          function then(message) {
            var historyString = req.user.attributes.first_name + ' ' +
              req.user.attributes.last_name + ' commented on message "' +
              message.attributes.subject.trim() + '"';
            Comments.createHistory(apartmentId, historyString);
            model.author = req.user.attributes.first_name;
            res.json(model);
          },
          function otherwise() {
            res.json(503, {error: 'Database error.'});
          });
      },
      function otherwise(error) {
        console.log(error);
        res.json(503, {error: 'Database error.'});
      });
  },

  // Deletes a comment on a message
  deleteComment: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var userId = req.user.attributes.id;
    var messageId = req.params.message;
    var commentId = req.params.comment;
    var apartmentId = req.user.attributes.apartment_id;

    if (!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message ID.'});
      return;
    } else if (!isValidId(commentId)) {
      res.json(400, {error: 'Invalid comment ID.'});
      return;
    }

    Comments.getMessage(messageId,
      function then(model) {
        Comments.destroyComment(messageId, commentId, userId,
          function then(model) {
            var historyString = req.user.attributes.first_name + ' ' +
              req.user.attributes.last_name + ' deleted their comment on message "' +
              model.attributes.subject.trim() + '"';
            Comments.createHistory(apartmentId, historyString);
            res.send(200);
          },
          function otherwise() {
            res.json(503, {error: 'Database error.'});
          });
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },

  // Adds a comment to a message in the DB
  createComment: function(userId, messageId, text, date, thenFun, otherFun) {
    new CommentModel({user_id: userId, message_id: messageId, body: text, date: date})
      .save()
      .then(thenFun)
      .otherwise(otherFun);
  },

  // Gets a message from the DB
  getMessage: function(messageId, thenFun, otherFun) {
    new MessageModel({id: messageId})
      .fetch()
      .then(thenFun)
      .otherwise(otherFun);
  },

  // Creates a history item
  createHistory: function(apartmentId, historyString) {
    new HistoryModel({apartment_id: apartmentId, history_string: historyString, date: new Date()})
    .save();
  },

  // Deletes a comment on a message in the DB
  destroyComment: function(messageId, commentId, userId, thenFun, otherFun) {
    new CommentModel()
      .query('where', 'id', '=', commentId, 'AND', 'message_id', '=', messageId, 'AND', 'user_id', '=', userId)
      .destroy()
      .then(thenFun)
      .otherwise(otherFun);
  }

};

// Checks if a value is an integer
function isInt(value) {
  return !isNaN(value) && parseInt(value) == value;
}

// Checks if a bill ID is valid
function isValidId(id) {
  return isInt(id) && id > 0;
}

module.exports = Comments;
