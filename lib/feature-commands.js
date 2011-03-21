/*
  Copyright (c) 2010 William A. Barnhill, Jr.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
 * This module is an example implementation of the Commands CommonKV feature.
 * It should only be used with the commonkv-mem store and should not be
 * used directly except in testing. Instead, like all features, it could be
 * accessed with store.feature('commands').  The goal with features is that they
 * shouldn't be specific to just one implementation but should be shared among several
 * implementations, each of which may provide the feature a little differently 
 * behind the scenes.
 *
 * @author w.a.barnhill@gmail.com Bill Barnhill
 */
module.exports = CommandsFeature;

/**
 * This creates the feature. It should not be called
 * directly except in testing.
 *
 * @constructor
 * @this {CommandsFeature}
 * @param {Store SPI} The store to operate on. This
 *    may have additional methods only for use by features.
 */ 
function CommandsFeature(storeSPI) {
  if(false === (this instanceof CommandsFeature)) {
    return new CommandsFeature(storeSPI);
  }
  if (storeSPI)
    this.store = storeSPI;
  else
    throw Error('No Store SPI provided');
};

CommandsFeature.prototype = {

 /**
  * Tests to see if the named command is supported
  *
  * @param {String} cmdName The command to check for
  * @param {Function} cb The callback
  * @result {Object} Object of form {'cmd': {String}, 'exists': {boolean}}
  */
 canDoCmd : function(cmdName, cb) {
    var result;
    if (/keys/.test(cmdName))
      result = {'cmd': cmdName, 'exists': true};
    else
      result = {'cmd': cmdName, 'exists': false};
    cb(false, result);
  },

 /**
  * Executes a command with a specific payload.
  *
  * @param {String} cmdName The command to execute
  * @param {Object} cmdPayload The command parameters
  * @param {Function} cb The callback
  * @result {Object} Object of form {'cmd': {String},  
  *    'payload': {Object}, 'data': {Object}}
  */
 doCmd : function(cmdName, cmdPayload, cb) {
    if (/keys/.test(cmdName)) {
      // Node as of v0.4.3 does not implement Ecma5 Object.getKeys
      var getKeys = function(obj) {
	var keys = [];
	for ( key in obj ) {
	  if ( obj.hasOwnProperty( key ) && typeof obj[key] !== "function" ) {
	    keys.push(key);
	  }
	}
	return keys;
      };
      var result = { 'cmd': cmdName,
		     'payload': cmdPayload,
		     'data': getKeys(this.store.data) };
      cb(false, result);
    }
    else {
      cb(Error("Unsupported Command:"+cmdName), undefined);
    }
  },

 /**
  * Boilerplate for other implementations. This implementation
  * just calls doCmd.
  *
  * @param {String} cmdName The command to execute
  * @param {Object} cmdPayload The command parameters
  * @param {Object} cmdMetadata The command context
  * @param {Function} cb The callback
  * @result {Object} Object of form:  
  *    {'cmd': {String}, 
  *    'payload': {Object},  
  *    'data': {Object}, 
  *    'meta': {Object}}
  */
 doCmdWithMeta : function(cmdName, cmdPayload, cmdMetadata, cb) {
    var wrappingCb = function(err, result) {
      if (result) {
	result.meta = cmdMetadata;
      }
      cb(err, result)
    };
    this.doCmd(cmdName, cmdPayload, wrappingCb);
  }
};
