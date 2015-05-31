describe("shHttp suite", function() {
	var Util,H,$H,Users,User; 
	beforeEach(module('SuhGeneral'));
	beforeEach(function(){
		inject(['shUtil','shHttp','$httpBackend',function(u,h,$h){
			console.log($h);
			Util = u;
			H = h;
			$H = $h;
		}]);

		Users = function(){
			H.call(this,{
				model:'user'
			});
		};
		Util.inherits(Users,H); 
		User = new Users();

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
	});

	it("should support http and restful requests", function() {
		$H.when('GET','/user/1')
			.respond({
				status:true,
				result:{
				id:1,
				firstname:'Suhail',
				lastname:'Abood',
				dob:'1988-04-17'
			}});
		
		
		var firstname = ''; 
		User.get(1).then(function(e){
			firstname = e.firstname;
		},function(f){
			firstname = f.firstname;
		});
		$H.flush(); 
		expect(firstname).toEqual('Suhail');
	});

	it("should support GET restful requests", function() {
		$H.when('POST','/user/create')
			.respond({
				status:true,
				result:{
				id:2,
				firstname:'Suhail',
				lastname:'Abood',
				dob:'1988-04-17'
			}});
		
		
		var id = ''; 
		User.create({firstname:'Suhail',lastname:'Abood',dob:'1988-04-17'}).then(function(e){
			id = e.id;
		},function(f){
			id = f.id;
		});
		$H.flush(); 
		expect(id).toEqual(2);
	});

	it("should support POST restful requests", function() {
		$H.when('POST','/user/create')
			.respond({
				status:true,
				result:{
				id:2,
				firstname:'Suhail',
				lastname:'Abood',
				dob:'1988-04-17'
			}});
		
		
		var id = ''; 
		User.create({firstname:'Suhail',lastname:'Abood',dob:'1988-04-17'}).then(function(e){
			id = e.id;
		},function(f){
			id = f.id;
		});
		$H.flush(); 
		expect(id).toEqual(2);
	});

	it("should support PUT restful requests", function() {
		var date = (new Date()); 
		$H.when('PUT','/user/2')
			.respond({
				status:true,
				result:{
				id:2,
				firstname:'Suhail',
				lastname:'Abood',
				dob:'1988-04-17',
				updated_at:date.toString()
			}});
		
		
		var id = 2, dt = null; 
		User.update(id,{firstname:'Suhail',lastname:'Abood',dob:'1988-04-17'}).then(function(e){
			dt = e.updated_at; 
		},function(f){
			id = f.id;
		});
		$H.flush(); 
		expect(date.toString()).toEqual(dt);
	});

	it("should support DELETE restful requests", function() {
		var date = (new Date()); 
		$H.when('DELETE','/user/2')
			.respond({
				status:true,
				result:{
				id:2,
				firstname:'Suhail',
				lastname:'Abood',
				dob:'1988-04-17',
				updated_at:date.toString()
			}});
		
		
		var id = 2, dt = null; 
		User.delete(id).then(function(e){
			dt = e.updated_at; 
		},function(f){
			id = f.id;
		});
		$H.flush(); 
		expect(date.toString()).toEqual(dt);
	});

	it("should support DELETE multiple ids through http post requests", function() {
		var date = (new Date()); 
		$H.when('POST','/user/delete',{ids:[1,2,3]})
			.respond({
				status:true,
				result:[{
				id:1,
				firstname:'Suhail',
				lastname:'Abood',
				dob:'1988-04-17',
				updated_at:date.toString()
			},{
				id:2,
				firstname:'Ahmad',
				lastname:'Abullah',
				dob:'1991-12-19',
				updated_at:date.toString()
			},{
				id:3,
				firstname:'John',
				lastname:'Doe',
				dob:'1987-01-27',
				updated_at:date.toString()
			}]});
		
		
		var name = '';
		User.delete([1,2,3]).then(function(e){
			name = e[2].firstname; 
		},function(f){
			id = f.id;
		});
		$H.flush(); 
		expect(name).toEqual('John');
	});


});