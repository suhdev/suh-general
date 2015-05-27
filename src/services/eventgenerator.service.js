/**
 * @ngdoc service
 * @name shEventGenerator
 * @module SuhGeneral
 * @requires shUtil
 * @description
 * Provides a basic implementation of an event generator mechanism
 * @todo {urgent} complete documentation.
 */
 angular.module('SuhGeneral')
 	.factory('shEventGenerator', ['shUtil',function (_UT) {
 		
 		var _eg = function(){
 			this._listeners = {};
 		};

 		_eg.prototype = {
 			
 			_register:function(evName){
 				this._listeners[evName] = this.listeners[evName] || [];
 			},
 			_unRegister:function(evName){
 				delete this._listeners[evName];
 			},
 			trigger:function(ev,value){
 				if (this.listeners[ev]){
 					angular.forEach(this.listeners[ev],function(fn){
 						fn(value);
 					});
 				}
 			},
 			on:function(eName,eFn,ctx,args){
 				if (!this.listeners[eName]){
 					throw new Error('Event: No such event')
 				}
 				this.listeners[eName].push(_UT.proxy(eFn,ctx,args));
 			},
 		};
 	
 		return {
 			Generator:_eg
 		};
 	}]);