var Chrono = function(){


}

var self;

Chrono.prototype.init = function(timeP){ //0 = normal | 1 = décroissant

	self = this;
	this.interval;
	if(typeof(timeP)==='undefined'){
		this.timeStamp = 0;
	}else{
		this.timeStamp = timeP;
	}
	
	this.start = function(){
		if(this.timeStamp == 0){ //Chrono normal
			this.interval = setInterval(function(){self.increase()},1000);
		}else{ //Chrono décroissant
			this.interval = setInterval(function(){self.decrease()},1000);
		}
	}
	
	this.pause = function(){
		clearInterval(this.interval);
	}
	
	this.reset = function(){ //stop the chrono too
		this.pause();
		this.timeStamp = 0;
	}
	
	this.increase = function(){
		this.timeStamp++;
	}
	
	this.decrease = function(){
		this.timeStamp--;
	}
	
	this.getTimeStamp = function(){
		return this.timeStamp;
	}
}