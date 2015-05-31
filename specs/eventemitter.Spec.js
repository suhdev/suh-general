describe("event emitter suite", function() {
	var SuhGeneral,EventEmitter,Util,Task,eee;
	beforeEach(module("SuhGeneral"));
	beforeEach(function(){
		eee = {
			name:'Suhail'
		};
		inject(['shEventEmitter','shUtil',function(U,Ut){
			EventEmitter = U;
			Util = Ut;
		}]);
		Task = function(){
			EventEmitter.call(this,['TaskAdded']);
		};
		Util.inherits(Task,EventEmitter); 
		Task.prototype.go = function(){
			this.trigger('TaskAdded',eee);
		};
	});
	it("should throw error if event name is registered", function() {
		var p = new Task();
		expect(p.go).toBeDefined();
		expect(p.addEventListener).toBeDefined();
		spyOn(p,'addEventListener').and.callThrough();
		expect(p.addEventListener).toThrowError();
	});

	it("should callback all listeners for a given event", function() {
		var p = new Task(),t = {
			callback:function(e){
				console.log('hey');
			}
		};
			
		var spy = spyOn(t,'callback'); 
		p.addEventListener('TaskAdded',t.callback,t);
		p.addEventListener
		p.go(); 
		p.removeEventListener('TaskAdded',t.callback);
		t.callback.calls.reset();
		p.go();
		expect(t.callback).not.toHaveBeenCalled();
		
	});


	
});