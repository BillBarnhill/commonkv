/*
Copyright (c) 2010 William A. Barnhill, Jr.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * This module demonstrates how to implement the CommonKV API by
 * providing a very simple in-memory CommonKV implementation
 * It is intended as an example or for testing.
 * 
 * @author w.a.barnhill@gmail.com Bill Barnhill
 */
module.exports = {

 /**
  * This is how any store will be created.  The options are store specific
  * but some commonalities are expected, such as 'server' for redis, etc.
  *
  * @param {Object} options The options needed to initialize and open store
  * @param {function} callback The callback to receive results or err 
  * @result {CommonKVStore} The opened and initialized store
  */
 openStore : function(options, callback) {
    var store = new MemStore();
    callback(false, store);
  }
};

 /**
  * This is a simple in-memory implementation of the CommonKV
  * API. More as an example than for actual use.
  *
  * @constructor
  * @this {MemStore}
  */
function MemStore() {
  if(false === (this instanceof MemStore)) {
    return new MemStore();
  }
  this.data = {};
}

MemStore.prototype = {

 /**
  * This sets one or more values for the given key.  If there are
  * any existing values then these are replaced by the new ones. The
  * old values are passed to the callback if any exist, or undefined is
  * passed if there are none.
  *
  * @param {String} key The key whose values we are setting
  * @param {Array} vals One or more values for this key
  * @param {function} callback The callback to receive results or err 
  * @result {Object} Object of form {'key': {String}, 'values': {Array[*]}, 'old': {Array[*]}}
  */
 setValue : function(key, vals, callback) {
    var prev = this.data[key] || undefined;
    var next = [].concat(vals);
    this.data[key] = next;
    var result = {'key': key, 'values': next, 'old': prev};
    callback(false, result);
  },

 /**
  * This sets one or more values for the given key.  If there are
  * any existing values then the new ones are added to these values.
  * There is no behavior defined as to the order of the values.
  *
  * @param {String} key The key whose values we are adding to
  * @param {Array} vals One or more values for this key
  * @param {function} callback The callback to receive results or err 
  * @result {Object} Object of form {'key': {String}, 'values': {Array[*]}, 'old': {Array[*]}}
  */
 addValues : function(key, vals, callback) {
    // Result: {'key': k, 'values': values}
    var prev = this.data[key] || undefined;
    var next = (prev || []).concat(vals);
    this.data[key] = next;
    var result = {'key': key, 'values': next, 'old': prev};
    callback(false, result);
  },

 /**
  * Get a single value for this key. If there are multiple values
  * then the selection of which one to use is implementation dependent.
  * For this reason it's better to use getValues unless you don't care
  * which value you get, as long as it's a value for the key.
  *
  * @param {String} key The key whose value we are getting
  * @param {function} callback The callback to receive results or err
  * @result {Object} Object of form {'key': {String}, 'value': *} 
  * @todo wab fix this so one value == one callback call
  */
 getValue : function(key, callback) {
    var val = this.data[key] || undefined;
    var result = {'key':key, 'value': val};
    callback(false, result);
  },

 /**
  * This gets the values mapped to the specified key. The order of the 
  * values is not defined.
  *
  * @param {String} key The key whose values we are getting
  * @param {function} callback The callback to receive results or err 
  * @result {Object} Object of form {'key': {String}, 'values': {Array[*]}}
  */
 getValues : function(key, callback) {
    var val = this.data[key] || undefined;
    var result = {'key':key, 'values': val};
    callback(false, result);
  },

 /**
  * This allows an async walkthrough of the
  * names of available features. The callback is
  * called once for each feature.  Implementations
  * may provide additional information besides the
  * two standard keys of 'feature' and 'exists'.
  *
  * @param {function} callback The callback to receive results or err 
  * @result {Object} Object of form {'feature': {String}, 'exists': {boolean}}
  */
 iterateFeatures : function(callback) {
    callback(false, {'feature': 'commands', 'exists': true});
  },
 
 /**
  * This allows access to feature specific properties.
  *
  * @param {string} featureName The name of the desired feature
  * @return {Object} The API implementation for the feature
  */
 feature : function(featureName) {
    // Result: object with feature specific properties and/or methods
    var CommandsFeature = require('./feature-commands.js');
    var store = this;
    return new CommandsFeature(store);
  },

 /**
  * Closes the store. In this case that just
  * means nulling out the internal references.
  * Nothing is specified about the non-null object sent if the store
  * is closed successfully, but it could be used by implementations to
  * provide final state information.
  *
  * @param {function} callback The callback to receive results or err 
  * @result {Object} A non-null Object is sent if store is successfully closed
  */
 close : function(callback) {
	this.data = null;
	callback(false, {'closed': true});
 } 
};


