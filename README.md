Commonkv
===

Commonkv is both a specification for a common API to access NOSQL KV stores, and an implementation of that specification that provides an in-memory KV store.


Install
---

	npm install commonkv


Getting Started
---

First off this module is not likely to be terribly helpful without one of the implementation modules, unless you want to write your own implementation.  If you are writing your own implementation then check out commonkv-mem.js for an example.

There are two Commonkv implementations underway: commonkv-redis and commonkv-telehash. This file will be updated as implementation work finishes. Other implementations that get created will also be listed here, with the URLs for their repositories and/or web sites.

A quick run down on the methods API follows.

First the commonkv implementation module, e.g. commonkv-mem, is imported in using require.

Next a store is opened using the openStore function on the module. This function takes one argument, an object containing the options for the store. A no option version of {} must be supported.

Once a store is gotten any of the following methods can be used on it.

     setValue(k, v[], cb(err, result))
     		 - > {'key': k, 'value': value, 'old': old value}
     
     addValues(k, v[], cb(err, result)) 
     		 - > {'key': k, 'values': values}
     
     getValue(k, cb(err, result)) 
     		 - > {'key': k, 'value': value}
     
     getValues(k, cb(err, result)) 
     		 - > {'key': k, 'values': values}
     
     testKey(k, cb(err, result)) 
     		 - > {'key': key, 'exists': T or F}
     
     close(cb(err, result))
     		 -> empty object for result and false for err if no err

     iterateFeatures(cb(err, result)) 
     		 - > {'feature': name, 'exists': T or F}
     
     hasFeature(featureName, cb(err, result)) 
     		 - > {'feature': name, 'exists': T or F}
     
     feature(featureName) 
     		 - >  object with feature specific properties and/or methods

 
Features
---

The last three functions above deal with features. Features are modular extensions to the commonkv API that not all implementations may support.  Features are a way to get to implementation specific capabilities.  They can just enough rope to get into the guts and do what you need, or enough to hang your project with.  The example implementation provides the commands feature, which has the following functions:

    canDoCmd(cmdName, cb(err, result)) 
     		 - > {'cmd': cmdName, 'exists': T or F}
    
    doCmd(cmdName, cmdPayload, cb(err, result)) 
     		 - > {'cmd': cmdName,  'payload': cmdPayload, 'data': actual result}
    
    doCmdWithMeta(cmdName, cmdPayload, cmdMetadata, cb(err, result)) 
     		 - >  {'cmd': cmdName, 
		      	  'payload': cmdPayload,  
		      	  'data': actual result, 
		      	  'meta': cmdMetadata}


Problems?
---

If you run into problems feel free to either create a new issue on github at:


Also feel free to contact me through any of the following channels:
* twitter: @BillBarnhill
* email: w.a.barnhill@gmail.com
* xmpp: w.a.barnhill@gmail.com
* irc: Room #commonkv on freenode, nick t|f

To-Do
---
* Convert bare bones test script into nodeunit tests and get some decent test coverage
* Package those into validation suite of tests that can be run against implementions. 
* Auto-generated documentation
* More implementations

LICENSE (MIT)
---

_Copyright (c) 2010 William A. Barnhill, Jr._

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
