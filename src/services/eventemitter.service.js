/**
 * @ngdoc service
 * @name shEventEmitter
 * @module SuhGeneral
 * @description
 * A service exposing the {@link EventEmitter EventEmitter} constructor to be inherited by
 * other classes. 
 * @returns {constructor} the {@link EventEmitter EventEmitter} constructor
 */

angular.module('SuhGeneral')
	.factory('shEventEmitter', [function () {
		/**
		 * @ngdoc type 
		 * @name EventEmitter
		 * @module SuhGeneral
		 * @param {Array<string>} events the supported events 
		 * @description
		 * An abstract class providing basic implementation for event emitters. 
		 * This class is intended to be inherited from by other classes. 
		 */
		function Emitter(events){
			/**
			 * @ngdoc property 
			 * @name EventEmitter#events
			 * @module SuhGeneral
			 * @description 
			 * Holds the objects supported events. 
			 */
			this.events = events || [];

			/**
			 * @ngdoc property
			 * @name EventEmitter#listeners
			 * @module SuhGeneral
			 * @type {object}
			 * @description
			 * An object literal in which the keys are the events names, and 
			 * the values are arrays of listeners. 
			 */
			this.listeners = {};
		}

		Emitter.prototype = {
			/**
			 * @ngdoc method
			 * @name EventEmitter#addEventListener
			 * @module SuhGeneral
			 * @param {string} evtName the event name (or type)
			 * @param {function} listener the listener function to call when the event is triggered. 
			 * @param {object} [ctx] the object on which the listener should be called. 
			 * @description 
			 * Add an event listener to a given event type. 
			 */
			addEventListener:function(evtName,listener,ctx){
				if (this.events.indexOf(evtName) === -1){
					throw new Error('The object does not support the event "'+evtName+'".');
				}
				this.listeners = this.listeners || {};
				this.listeners[evtName] = this.listeners[evtName] || [];
				var fn = ctx?angular.bind(ctx,listener):listener;
				fn.fn = listener;
				this.listeners[evtName].push(fn);
			},

			/**
			 * @ngdoc method
			 * @name EventEmitter#removeEventListener
			 * @module SuhGeneral
			 * @param {string} evtName the event name (or type)
			 * @param {function} listener the listener function to to remove. 
			 * @description 
			 * Removes an event listener from a given event.  
			 */
			removeEventListener:function(evtName,listener){
				if (!this.listeners[evtName]){
					throw new Error("Event '"+evtName+"' is not registered.");
				}
				var i=0,list=this.listeners[evtName],l=list.length,idx =-1;
				for(;i<l;i++){
					if (list[i].fn === listener){
						idx = i;
						break;
					}
				}
				if (i !== -1){
					this.listeners[evtName].splice(i,1);
				}
			},

			/**
			 * @ngdoc method
			 * @name EventEmitter#trigger
			 * @module SuhGeneral
			 * @param {string} evtName the event name (or type) of the triggered event
			 * @param {object} e the event object to pass to the listeners
			 * @description
			 * Triggers a given event by calling all event listeners. 
			 */
			trigger:function(evtName,e){
				if (this.listeners[evtName]){
					var list = this.listeners[evtName],i,l;
					for(i=0,l=list.length;i<l;i++){
						list[i](e);
					}
				}
			},
			/**
			 * @ngdoc method
			 * @name EventEmitter#on 
			 * @module SuhGeneral 
			 * @param {string} evtName the event name or type to listen to.
			 * @param {function} fn the function to call. 
			 * @param {object} [ctx] the context on which the function should be called. 
			 * @description 
			 * Registers a listener 
			 */ 
			on:function(evt,fn,ctx){
				return this.addEventListener(evt,fn,ctx);
			}
		};
	
		return Emitter;
	}]);