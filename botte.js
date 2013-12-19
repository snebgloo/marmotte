var Botte = function(){
	

}

Botte.prototype.init = function(contextP){

	this.x = 0;
	this.y = 0;
	this.context = contextP;
	this.animFile = 'botte.png';
	this.outputPrint = new Image();
	this.outputPrint.src = "img/"+this.animFile;
	
	this.getX = function(){
		return this.x;
	}
	
	this.getY = function(){
		return this.y;
	}
	
	this.setX = function(xP){
		this.x = xP;
	}
	
	this.setY = function(yP){
		this.y = yP;
	}
	
	this.update = function(xP,yP){
		//Màj coordonnées botte
		this.setX(xP);
		this.setY(yP);
	}
	
	this.changeBotte = function(animFileP){
		this.animFile = animFileP;
		this.outputPrint.src = "img/"+this.animFile;
	}
	
	this.affiche = function(){
		this.context.drawImage(this.outputPrint,this.getX()-47,this.getY()-57,this.outputPrint.width,this.outputPrint.height); //url,x,y,w,h
	}

}