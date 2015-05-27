describe("application data suite", function() {
	var SuhGeneral,AppDataProvider,AppData; 

	beforeEach(module("SuhGeneral"));
	beforeEach(function(){
		module(['shApplicationDataProvider',function(SP){
			AppDataProvider = SP;
			AppDataProvider.setExtensions({
				getLatitude:function(){
					return 10.0;
				},
				getSpecific:function(e){
					return this.get('okay');
				}
			});
		}]);
		 inject(['shApplicationData',function(U){
		 	AppData = U;
		 }]);

	});
	it('it should add methods to application provider',function(){
		// AppData = AppDataProvider.$get();
		expect(AppData.getLatitude).toBeDefined();
		expect(AppData.getSpecific).toBeDefined();
		expect(AppData.getLatitude()).toEqual(10.0);
		expect(AppData.data).toBeDefined();
		AppData.set('okay','Hello');
		expect(AppData.data.okay).toBeDefined();
		expect(AppData.getSpecific('s')).toEqual('Hello');
	});

	it('it should set data of the application',function(){

	});
	
});