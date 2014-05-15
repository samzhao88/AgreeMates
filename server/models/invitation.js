/*
 * This is the model representation for a single invitation
 * attributes:
 *  id            int,
 *  apartment_id  int
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var ApartmentModel = require('./apartment').model;

exports.model = Bookshelf.Model.extend({
  tableName: 'invitations',
  apartment: function() {
    return this.belongsToOne(ApartmentModel);
  }
});

exports.collection = Bookshelf.Collection.extend({
  model: exports.model
});
