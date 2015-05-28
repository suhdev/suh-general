/**
 * @ngdoc service
 * @name shBlockNavigation
 * @module SuhGeneral
 * @description
 * A service to stop users from navigation away from the page. 
 */
angular.module('SuhGeneral')
	.factory('shBlockNavigation', [function () {
		var requestBlock = false,
			block = function block(text){
				window.onbeforeunload = function() {
				  return text || 'Are you sure you want to leave? you may lose any unsaved work';
				};
			},
			unblock = function unblock(){
				window.onbeforeunload = undefined;
			};
		return {
			/**
			 * @ngdoc method
			 * @name shBlockNavigation#block
			 * @module SuhGeneral
			 * @param {string} the text to show to the user. 
			 * @description
			 * Stop the user from navgiating away from the page
			 */

			block:block,
			/**
			 * @ngdoc method
			 * @name shBlockNavigation#unblock
			 * @module SuhGeneral
			 * @description
			 * Allow user to navigate away from the page, removing any block callbacks. 
			 */
			unblock:unblock
		};
	}]);