describe("localizer service suite", function() {
	var SuhGeneral,Cache,Localizer,$H;
	beforeEach(module("SuhGeneral"));
	beforeEach(function(){
		angular.module('SuhGeneral').value('shLOCALE','en_GB');
		
		inject(['shLocalizer','shUtil','$httpBackend',function(L,Ut,$h){
			Localizer = L;
			Util = Ut;
			$H = $h;
		}]);
		
	});
	it("defined methods", function() {
		expect(Localizer.load).toBeDefined();
		expect(Localizer.ready).toBeDefined();
		expect(Localizer.isLoaded).toBeDefined();
		expect(Localizer.get).toBeDefined();
		expect(Localizer.format).toBeDefined();
		
	});

	it("load sample data",function(){
		Localizer.load({
			welcome:'Welcome ${user}, how are you?',
			exit:'Exit window'
		});


		expect(Localizer.get('welcome')).toEqual('Welcome ${user}, how are you?');
		expect(Localizer.get('welcome',{user:'Suhail'})).toEqual('Welcome Suhail, how are you?');
		expect(Localizer.get('welcome',{xuser:'Suhail'})).toEqual('Welcome ${user}, how are you?');
	});

	it("load data from server",function(){
		$H.when('GET', '/translations_en.json')
            .respond({
            	welcome:'Welcome ${user}, how are you?',
            	perform:'Perform ${command} now.'
            }, {});
        Localizer.load('/translations_en.json');
        $H.flush();
        expect(Localizer.get('welcome')).toEqual('Welcome ${user}, how are you?');
	});

	it("load data from server",function(){
		$H.when('GET', '/translations_en.json')
            .respond({
            	welcome:'Welcome ${user}, how are you?',
            	perform:'Perform ${command} now.'
            }, {});
        Localizer.load('/translations_en.json');
        $H.flush();
        expect(Localizer.get('welcome')).toEqual('Welcome ${user}, how are you?');
        expect(Localizer.get('welcome',{user:'Sahloon'})).toEqual('Welcome Sahloon, how are you?');
	});

});