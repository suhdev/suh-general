/**
 * @ngdoc service
 * @name shDataTransformer
 * @module SuhGeneral
 * @description
 * A service that provide a simple data transformer 
 * that allows for chaining transformations. 
 */
angular.module('SuhGeneral')
	.factory('shDataTransformer',[function(){
		/**
		 * @ngdoc type
		 * @name DataTransformer
		 * @module SuhGeneral
		 * @description
		 * A chainable data transformer
		 */
		var _dt = function(){
			this.data = {}; 
			this.originalData = {}; 
		};

		_dt.prototype = {
			/**
			 * @ngdoc method
			 * @name DataTransformer#original 
			 * @module SuhGeneral
			 * @description
			 * @returns {any} the data before applying any of the transformations. 
			 */
			original:function(){
				return this.originalData; 
			},
			/**
			 * @ngdoc method
			 * @name DataTransformer#input
			 * @module SuhGeneral
			 * @param {any} data the data to transform 
			 * @description
			 * @returns {DataTransformer} the data transformer instance. 
			 */
			input:function(data){
				this.data = data; 
				this.originalData = data; 
				return this; 
			},
			/**
			 * @ngdoc method
			 * @name DataTransformer#processor
			 * @module SuhGeneral
			 * @param {function} fn the transformation function which will be passed 
			 * the input data. 
			 * @description
			 * Registers a new data processor and executes the transformation. 
			 * @returns {DataTransformer} the current transformer instance. 
			 */
			processor:function(fn){
				this.data = fn(this.data);
				return this;
			},
			/**
			 * @ngdoc method
			 * @name DataTransformer#out
			 * @module SuhGeneral
			 * @description
			 * @returns {any} the data after all the transformations; 
			 */
			out:function(){
				return this.data;
			}
		};

		return function(){
			return new _dt();
		};
	}]);