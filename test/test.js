var ckv = require('commonkv');
var async = require('async');

var logit = function(err,res) {
  if (err) throw err;
  console.log(res);
};

//ckv.openStore({}, logit);
var tryit = function(err,res) {
  var store = res;
  store.setValue('foo', [1,2,3],
		 function(err,res) {
		   if (err) throw err;
		   console.log(res);
		   store.setValue('foo', [4,5,6], logit);
		 }
		 );
  store.close(logit);
};
ckv.openStore({}, tryit);


var tryit = function(err,res) {
  var store = res;
  store.setValue('foo', [1,2,3],
		 function(err,res) {
		   if (err) throw err;
		   console.log(res);
		   store.addValues('foo', [4,5,6], logit);
		 }
		 );
  store.close(logit);
};
ckv.openStore({}, tryit);

var tryit = function(err,store) {
  store.iterateFeatures(logit);
  store.close(logit);
};
ckv.openStore({}, tryit);

// requires async, install with npm install async
console.log('\nBringing it together...');
async.waterfall([
		 function(callback){
		   ckv.openStore({}, callback);
		 },
		 function(store, callback){
		   console.log('opened store:'+JSON.stringify(store));
		   var wrapping = function(err,result) {
		     if (result)
		       result.store = store;
		     callback(err, result);
		   };
		   store.setValue('foo', [1,2,3], wrapping);
		 },
		 function(setValueResult, callback){
		   console.log('from setValue #1:'+JSON.stringify(setValueResult));
		   var wrapping = function(err,result) {
		     if (result)
		       result.store = setValueResult.store;
		     callback(err, result);
		   };
		   setValueResult.store.setValue('bar', [4,5,6], wrapping);
		 },
		 function(setValueResult, callback){
		   console.log('from setValue #2:'+JSON.stringify(setValueResult));
		   var wrapping = function(err,result) {
		     if (result)
		       result.store = setValueResult.store;
		     callback(err, result);
		   };
		   var cmds = setValueResult.store.feature('commands');
		   console.log('feature='+JSON.stringify(cmds));
		   cmds.doCmd('keys',null, wrapping);
		 },
		 function(cmdResult, callback){
		   console.log('keys:'+JSON.stringify(cmdResult.data));
		   callback(null, cmdResult.store);
		 },
		 function(store, callback){
		   console.log('Store pre-closing:'+JSON.stringify(store));
		   store.close(callback);
		 },
		 function(storeCloseResult, callback){
		   console.log('from close:'+JSON.stringify(storeCloseResult));
		 }
		 ], function(err){
		  throw Error(err);
		});


