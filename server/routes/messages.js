// Messages routes
// jshint camelcase: false

'use strict';

var MessageModel = require('../models/message').model;
var CommentModel = require('../models/comment').model;
var HistoryModel = require('../models/history').model;
var Bookshelf = require('bookshelf');

// Checks if a value is an integer
function isInt(value) {
  return !isNaN(value) && parseInt(value) == value;
}

// Checks if a bill ID is valid
function isValidId(id) {
  return isInt(id) && id > 0;
}

var Messages = {
  setup: function(app) {
    app.get('/messages', Messages.getMessages);
    app.post('/messages', Messages.addMessage);
    app.put('/messages/:message', Messages.editMessage);
    app.delete('/messages/:message', Messages.deleteMessage);
  },
  getMessages: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    Messages.queryMessages(apartmentId,
      function then(rows) {
        var messages = [];
        var comments = [];
        if (rows.length === 0) {
          res.json({messages: messages});
          return;
        }

        // set lastMessageId to invalid ID so algorithm will owrk
        var lastMessageId = -1;
        var subject, text, author, date, user_id;
        for (var i = 0; i < rows.length; i++) {

          // If message_id is different than lastMessageId then
          // all the comments for the current message have been
          // added to comments[]. Push the current message and comments
          // on array and start next message
          if (rows[i].messageId !== lastMessageId) {
            if (lastMessageId !== -1) {
              messages.push({
                id: lastMessageId,
                subject: subject,
                body: text,
                author: author,
                date: date,
                comments: comments,
                user_id: user_id
              });
            }
            // empty comments since last message is done and set
            // all the fields for the new message
            comments = [];
            lastMessageId = rows[i].messageId;
            subject = rows[i].subject;
            text = rows[i].body;
            author = rows[i].authorName;
            date = rows[i].messageDate;
            user_id = rows[i].user_id;
          }
          if (rows[i].commentId !== null) {
            comments.push({
              id: rows[i].commentId,
              author: rows[i].commentAuthor,
              body: rows[i].commentBody,
              date: rows[i].commentDate,
              user_id: rows[i].comment_user_id
            });
          }
        }
        // Push last message onto the messages array
        messages.push({
          id: lastMessageId,
          subject: subject,
          body: text,
          author: author,
          date: date,
          comments: comments,
          user_id: user_id
        });
        res.json({messages: messages});
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },
  addMessage: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    // Copy over fields from request
    var apartmentId = req.user.attributes.apartment_id;
    var userId = req.user.attributes.id;
    var subject = req.body.subject;
    var text = req.body.body;

    // Check fields for validity
    if (subject === undefined) {
      res.json(400, {error: 'Invalid message subject.'});
      return;
    } else if (text === undefined) {
      res.json(400, {error: 'Invalid message body.'});
      return;
    }

    Messages.createMessage(apartmentId, userId, subject, text,
      function then(model) {
        var historyString = req.user.attributes.first_name + ' ' +
          req.user.attributes.last_name + ' added a message "' +
          subject.trim() + '" to the message board';
        Messages.saveHistory(apartmentId, historyString);
        res.json(model);
      }, function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },
  editMessage: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    // Copy over fields from the request
    var apartmentId = req.user.attributes.apartment_id;
    var userId = req.user.attributes.id;
    var messageId = req.params.message;
    var subject = req.body.subject;
    var text = req.body.body;

    if (!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message ID.'});
      return;
    } else if (subject === undefined) {
      res.json(400, {error: 'Invalid message subject.'});
      return;
    } else if (text === undefined) {
      res.json(400, {error: 'Invalid message body.'});
    }

    // Get and update the model from the database
    Messages.saveMessage(messageId, apartmentId, userId, subject, text,
      function then() {
        var historyString = req.user.attributes.first_name + ' ' +
          req.user.attributes.last_name + ' edited their message "' +
          subject.trim() + '"';
        Messages.saveHistory(apartmentId, historyString);
        res.send(200);
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },
  deleteMessage: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var messageId = req.params.message;
    var userId = req.user.attributes.id;

    if (!isValidId(messageId)) {
      res.json(400, {error: 'Invalid message ID.'});
      return;
    }

    Messages.fetchMessage(messageId,
      function then(model) {
        var historyString = req.user.attributes.first_name + ' ' +
          req.user.attributes.last_name + ' deleted the message "' +
          model.attributes.subject.trim() + '"';
        Messages.saveHistory(apartmentId, historyString);
        // Destroy all of the comments on the message and then
        // destroy the message itself. The user must be the one
        // who created the message.
        Messages.destroyComments(messageId, userId,
          function then() {
            Messages.destroyMessage(messageId, apartmentId,
              function then() {
                res.send(200);
              },
            function otherwise() {
              res.json(503, {error: 'Error deleting message'});
            });
        },
        function otherwise() {
          res.json(503, {error: 'Error deleting comments'});
        });
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },
  destroyMessage: function(messageId, apartmentId, thenFun, otherwiseFun) {
    new MessageModel()
    .query('where', 'id', '=', messageId, 'AND',
           'apartment_id', '=', apartmentId)
    .destroy()
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  fetchMessage: function(messageId, thenFun, otherwiseFun) {
    new MessageModel({id: messageId})
    .fetch()
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  destroyComments: function(messageId, userId, thenFun, otherwiseFun) {
    new CommentModel()
    .query('where', 'message_id', '=', messageId, 'AND',
           'user_id', '=', userId)
    .destroy()
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  saveMessage: function(messageId, apartmentId, userId, subject, text,
                        thenFun, otherwiseFun) {
    new MessageModel({id: messageId, apartment_id: apartmentId,
                     user_id: userId})
    .save({subject: subject, body: text})
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  createMessage: function(apartmentId, userId, subject, text,
                          thenFun, otherwiseFun) {
    // Create the new message in the database.
    new MessageModel({apartment_id: apartmentId, user_id: userId,
                     subject: subject, body: text, date: new Date()})
    .save()
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  saveHistory: function(apartmentId, historyString) {
    new HistoryModel({apartment_id: apartmentId,
                     history_string: historyString, date: new Date()})
    .save();
  },
  queryMessages: function(apartmentId, thenFun, otherwiseFun) {
    Bookshelf.DB.knex('messages')
    .join('users as author', 'messages.user_id', '=', 'author.id', 'left outer')
    .join('comments', 'messages.id', '=', 'comments.message_id', 'left outer')
    .join('users', 'comments.user_id', '=', 'users.id', 'left outer')
    .where('messages.apartment_id', '=', apartmentId)
    .select('messages.id as messageId', 'messages.subject', 'messages.body',
          'author.first_name as authorName', 'messages.date as messageDate',
          'users.first_name as commentAuthor', 'comments.id as commentId',
          'comments.body as commentBody', 'comments.date as commentDate',
          'messages.user_id as user_id', 'comments.user_id as comment_user_id')
    .orderBy('messageId', 'desc')
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
};

module.exports = Messages;
