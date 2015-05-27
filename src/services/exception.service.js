/**
 * @ngdoc service
 * @name shException
 * @module SuhGeneral
 * @description
 * A factory for generating {SuhException} objects
 * @param {Number} code error code 
 * @param {string} description error description 
 * @returns {SuhException} a new instance of SuhGeneral.Exception
 */
angular.module('SuhGeneral')
	.factory('shException', [function () {
		/**
		 * @ngdoc type
		 * @name  SuhException
		 * @module SuhGeneral
		 * @param  {number} code error code
		 * @param  {string} desc error description
		 */
		var _ge = function(code,desc){
			this._code = code;
			this._desc = desc;
		};

		_ge.prototype = {
			/**
			 * @ngdoc method
			 * @name SuhException#code
			 * @description
			 * Returns the error code of the exception
			 * @module SuhGeneral
			 * @returns {Number} error code
			 */
			code:function(){
				//get exception code
				return this._code;
			},
			/**
			 * @ngdoc method
			 * @name SuhException#description
			 * @module SuhGeneral
			 * @description
			 * Returns the error desciption of the exception
			 * @returns {string} error description
			 */
			description:function(){
				//get exception description
				return this._desc;
			},
			toString:function(){
				return 'Error with code: '+this._code+
						' has occured.\n'+this._desc;
			}
		};
	
		return function(c,d){
			return new _ge(c,d);
		};
	}])