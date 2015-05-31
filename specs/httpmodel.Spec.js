describe("shHttp suite", function() {
	var Util,H,$H,Users,User; 
	beforeEach(module('SuhGeneral'));
	beforeEach(function(){
		inject(['shUtil','shHttpModel','$httpBackend',function(u,h,$h){
			Util = u;
			H = h;
			$H = $h;
		}]);

		User = H({
				model:'user'
			},{
			getByAuth:function(){
				return this.get('auth');
			}
		});
		console.log(User);

	});

	it("should support http and restful requests", function() {
		expect(User.get).toBeDefined();
		expect(User.update).toBeDefined();
		expect(User.create).toBeDefined();
		expect(User.delete).toBeDefined();
		expect(User.httpGet).toBeDefined();
		expect(User.httpPost).toBeDefined();
		expect(User.httpPut).toBeDefined();
		expect(User.httpDelete).toBeDefined();
		expect(User.httpHead).toBeDefined();
		expect(User.getByAuth).toBeDefined();
	});

	it("should send a get request", function() {
		$H.when('GET','/user/auth')
			.respond({
				status:true,
				result:{
					id:1,
					firstname:'Jack',
					lastname:'Walmsley'
				}
			});

		var firstname = ''; 

		User.getByAuth().then(function(e){
			firstname = e.firstname; 
		});

		$H.flush();

		expect(firstname).toEqual('Jack');
	});



});