var Marmotte = function(){


}

Marmotte.prototype.init = function(xP, yP, lifeP, animStateP, stateP,contextP){

	this.x = xP; //coordonnee en x
	this.y = yP; //coordonnee en y
	this.life = lifeP; //vie de la marmotte
	this.animState = animStateP; //animation en cours (0 : statique - 1 : qui court - 2 : rentre dans son terrier - 3 : sort de son terrier - 4 : morte)
	this.state = stateP; //état de la marmotte (0 : en vie - 1 : étourdit - 2 : morte)
	this.animFile;
	this.context = contextP;
	this.outputPrint = new Image();
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.xDest;
	this.yDest;
	this.testMove;
	
	this.getX = function(){
		return this.x;
	}
	
	this.getY = function(){
		return this.y;
	}
	
	this.getLife = function(){
		return this.life;
	}

	this.getAnimState = function(){
		return this.animState;
	}
	
	this.getState = function(){
		return this.state;
	}
	
	this.setX = function(xP){
		this.x = xP;
	}
	
	this.setY = function(yP){
		this.y = yP;
	}
	
	this.setLife = function(lifeP){
		this.life = lifeP;
	}
	
	this.setAnimState = function(animStateP){
		this.animState = animStateP;
	}
	
	this.setState = function(stateP){
		this.state = stateP;
		
	}
	
	this.perdreVie = function(){
		this.life--;
		if(this.life == 0){
			this.setState(2); //si sa vie tombe à 0 elle meurt
			this.setAnimState(4);
		}
	}

	
	
	this.affiche = function(){
		this.animFile = "";
		switch(this.animState){
			case 0: this.animFile = "marmotte.png";
				break;
			case 1: this.animFile = "marmotte.png";
				break;
			case 2: this.animFile = "marmotte.png";
				break;
			case 3: this.animFile = "marmotte.png";
				break;
			case 4: this.animFile = "marmotte_petee.png";
				break;
		}
		this.outputPrint.src = "img/"+this.animFile;
		this.context.drawImage(this.outputPrint,this.getX(),this.getY(),this.outputPrint.width,this.outputPrint.height); //url,x,y,w,h
	}
	
	this.prepareToMove = function(xEnd,yEnd){
		this.xDest = xEnd;
		this.yDest = yEnd;
		//Calcul xSpeed facteur de déplacement en px/t
		this.xSpeed = (this.xDest - this.getX())/(1000/15); // Distance en px / période de dessin à 30fps
		this.ySpeed = (this.yDest - this.getY())/(1000/15);
		this.setAnimState(1); //Lancement du mouvement
	}
	
	this.move = function(){ //Itérative : à appeler avec une période
		this.testMove = false;
		if(Math.abs(this.getX()-this.xDest) > Math.abs(this.xSpeed)){ //Mouvement non fini
			this.setX(this.getX()+this.xSpeed);
			this.testMove = true;
		}
		if(Math.abs(this.getY()-this.yDest) > Math.abs(this.ySpeed)){
			this.setY(this.getY()+this.ySpeed);
			this.testMove = true;
		}
		if(this.testMove){ //si elle bouge
			//console.log(this.getAnimState());
		}else{
			this.setAnimState(0);
		}
			
		
	}
	
}
