/** 
 * @ngdoc service
 * @name shLocationListener
 * @module SuhGeneral
 * @description implements observer pattern to notify listeners for Location changes.
 * @requires  shException
 */
angular.module('SuhGeneral')
	.factory('shLocationListener',
		['$location','shException', function ($L,_GE) {
		var _gll = function(){
			this._observers = [];
			this._parts = $L.path().match(/[a-zA-Z0-9\-]+/g);
		};

		_gll.prototype = {
			/**
			 * @ngdoc method
			 * @name  shLocationListener#register
			 * @module SuhGeneral
			 * @description registers an observer to be notified on Location changes
			 * @param {object} observer the observer object to be registered
			 */
			register:function(observer){
				if (this._observers.indexOf(observer) === -1){
					if (typeof observer.onLocationChange !== 'undefined')
						this._observers.push(observer);
					else{
						throw _GE(0x01,'Observer does not implement onLocationChange').toString();
					}
				}			
			},
			/**
			 * @ngdoc method
			 * @name  shLocationListener#unregister
			 * @module SuhGeneral
			 * @description unregisters an observer 
			 * @param {object} observer the observer object to be unregistered
			 */
			unregister:function(observer){
				var idx = this._observers.indexOf(observer);
				if (idx !== -1)
					this._observers.splice(idx,1);
			},
			/**
			 * @ngdoc method
			 * @name  shLocationListener#_process
			 * @module SuhGeneral
			 * @description invoked everytime location changes to notify all observers
			 */
			_process:function(){
				this._parts = $L.path().match(/[a-zA-Z0-9\-]+/g); 
				if (this._parts !== null && this._parts.length > 0)
					for(var i=0;i<this._observers.length;i++)
						this._observers[i].onLocationChange(this._parts[0],
							this._parts);
			},
			/**
			 * @ngdoc method
			 * @name  shLocationListener#get
			 * @module SuhGeneral
			 * @description returns the parts array of the current location 
			 */
			get:function(){
				return this._parts;
			}
		};
	
		return new _gll();
	}]);
