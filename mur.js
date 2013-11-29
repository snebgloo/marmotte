var Mur = function(){
	
    
};

Mur.prototype.init = function(contextAudio, y, impulseResponse, maxGain){
    
    this.delay = contextAudio.createDelay();
    this.convolver = contextAudio.createConvolver();
    this.output = contextAudio.createGain();
    this.distance = y;
    this.gainValue = maxGain;
    
    this.convolver.buffer = impulseResponse;
    
    this.delay.connect(this.convolver);
    this.convolver.connect(this.output);
    
    
    
    this.connect = function(source) {
        source.connect(this.delay);
    }
    
    this.realSourceMoved = function(newY) {
        var totalDistance = Math.abs(this.distance) + Math.abs(this.distance - newY);
        totalDistance = totalDistance * 300 / 8;
        var currentDelay = totalDistance / 300;
        this.delay.delayTime = currentDelay;
        
        this.output.gain.value = this.gainValue * ( 1 / (600 - (totalDistance - this.distance)));
        console.log(totalDistance);
        console.log(this.output.gain.value);
    }
    
    
};
