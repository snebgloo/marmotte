var canvas;
var context;
var tabMarmottes = new Array();
var botte;
var nbMarmottesMax = 1;
var fond;
var score;
var level;
var scoreValue = 0;
var levelValue = 1;
var chrono;
var gameTime = 100;
var first = 0;

// garder inverse car correspond bien à échelle logarithmique de l'oreille
// rolloff 0.1
// refDistance 0.01
// + limiter valeur min des positions


var audio;
var contextAudio;
var urlList =[
                  'sound/terreMarmotte2.wav',
                  'sound/impulseResponse.wav',
                  'sound/MarmotteBouge1.wav',
                  'sound/ambianceNoBirds.wav',
                  'sound/SonFaux4_faibledB.wav',
                  'sound/Reussite1_faibledB.wav'
                ];
var bufferList = new Array();
var bufferLoader;
var sourceMarmotte;
var pannerMarmotte;
var delay;
var reverb;
var murDevant;
var murDerriere;
var sourceAmbiance;
var sourceTerrier;
var sourceMarteau;
var pannerTerrier;

var pointMarmotteAudio = { 'x': 0, 'z': 0 };
var pointTerrierAudio = { 'x': 0, 'z': 0 };

function preload(){
	// Création du contexte audio
	audio = new Audio.prototype.init();
	audio.initContext();
	document.addEventListener("fullyLoaded",loadComplete);
	
}

function loadComplete(){
	document.getElementById("jeuBtn").disabled = false;
}

function displayGame(){
        document.getElementById("jeuBtn").disabled = true;
	mainGame();
}

function mainGame(){
    
	//Récupération du canvas
	canvas = document.getElementById('jeu');
	canvas.style.visibility = "visible";
	context = canvas.getContext('2d');
	context.font = "18px Arial";
	context.fillStyle="#9b0909";
	
	//Affichage du fond
	fond = new Image();
	fond.src = 'img/background_game.jpg';
	//Changement curseur
	canvas.style.cursor = "none";
	
	//chronometre
	chrono = new Chrono.prototype.init(gameTime);
	chrono.start();
	
	//Affichage curseur
	botte = new Botte.prototype.init(context);
	
	//Animation - Déroulement du jeu
	var animateInterval = setInterval(animate, 1000/30); //Appel 30 fois / s � la fonction animate pour dessiner
        
	function animate()
	{
		context.clearRect(0,0,canvas.width,canvas.height);
		context.drawImage(fond,0,0,fond.width,fond.height); //url,x,y,w,hx
		for(i = 0; i< tabMarmottes.length; i++){
			tabMarmottes[i].affiche();
                        
			if(tabMarmottes[i].getAnimState()>=2 && tabMarmottes[i].getAnimState()<=6){
				tabMarmottes[i].move();
                                
                                // on fait correspondre les coordonnées de la marmotte dans le canvas à celles du repère audio
                                pointMarmotteAudio = repereAudio(tabMarmottes[i].getX(), tabMarmottes[i].getY());
                
                                // on évite 0.01² et moins de distance entre le listener et la marmotte qui feraient exploser le gain à cause de l'échelle lograrithmique
                                // -> x² + z² doit être < à refDistance²
                                if(pointMarmotteAudio.x * pointMarmotteAudio.x + pointMarmotteAudio.z * pointMarmotteAudio.z >= pannerMarmotte.refDistance * pannerMarmotte.refDistance)
                                {
                                    // on actualise le panner selon ces coordonnées
                                    pannerMarmotte.setPosition(pointMarmotteAudio.x, 0, pointMarmotteAudio.z);
                                    //console.log("x : " + pointMarmotteAudio.x + " z : " + pointMarmotteAudio.z);
                                    
                                    
                                    murDevant.realSourceMoved(pointMarmotteAudio.z);
                                    murDerriere.realSourceMoved(pointMarmotteAudio.z);
                                    
                                }
                

			}
		}
		botte.affiche();
		context.fillText("Score : "+scoreValue, 200,20);
		context.fillText("Temps : "+chrono.getTimeStamp(), 400,20);
	}
	
	//Animation - Gestion des marmottes
	var dataInterval = setInterval(updateData, 1000);
	
	function updateData(){
		
		//-------------MARMOTTES-------------
		
		//Vérification des marmottes mortes
		for(i = 0; i<tabMarmottes.length; i++){					
			//Traitement sur l'animState
			switch(tabMarmottes[i].getAnimState()){
				case 0://Création marmotte
					console.log('Création marmotte');
                                        
                                        if(first==1) {
                                            // lancement du son de sortie du terrier
                                            sourceTerrier = audio.playSound(0, sourceTerrier, false, true, 1);

                                            // pré placement des coordoonées audio pour éviter un clic lors du changement de place
                                            // on fait correspondre les coordonnées du terrier dans le canvas à celles du repère audio
                                            pointTerrierAudio = repereAudio(tabMarmottes[tabMarmottes.length-1].getX(), tabMarmottes[tabMarmottes.length-1].getY());

                                            // on évite 0.01² et moins de distance entre le listener et le terrier qui feraient exploser le gain à cause de l'échelle lograrithmique
                                            // -> x² + z² doit être < à refDistance²
                                            if(pointTerrierAudio.x * pointTerrierAudio.x + pointTerrierAudio.z * pointTerrierAudio.z >= pannerTerrier.refDistance * pannerTerrier.refDistance)
                                            {
                                                // on actualise le panner selon ces coordonnées
                                                pannerTerrier.setPosition(pointTerrierAudio.x, 0, pointTerrierAudio.z);
                                            }
                                        }
                                        
                                        else {
                                            first=1;
                                        }
                                        
					break;
				case 1://Sortie du terrier
					console.log('Sortie du terrier');
                                        // lancement du son de déplacement
                                        sourceMarmotte = audio.playSound(2, sourceMarmotte, false, true, 0);

                                        // pré placement des coordoonées audio pour éviter un clic lors du changement de place
                                        // on fait correspondre les coordonnées de la marmotte dans le canvas à celles du repère audio
                                        pointMarmotteAudio = repereAudio(tabMarmottes[tabMarmottes.length-1].getX(), tabMarmottes[tabMarmottes.length-1].getY());

                                        // on évite 0.01² et moins de distance entre le listener et la marmotte qui feraient exploser le gain à cause de l'échelle lograrithmique
                                        // -> x² + z² doit être < à refDistance²
                                        if(pointMarmotteAudio.x * pointMarmotteAudio.x + pointMarmotteAudio.z * pointMarmotteAudio.z >= pannerMarmotte.refDistance * pannerMarmotte.refDistance)
                                        {
                                            // on actualise le panner selon ces coordonnées
                                            pannerMarmotte.setPosition(pointMarmotteAudio.x, 0, pointMarmotteAudio.z);
                                           // console.log("x : " + pointMarmotteAudio.x + " z : " + pointMarmotteAudio.z);
                                        }
					break;
				case 2: console.log('Déplacement marmotte');
                                        break;
				case 3: console.log('Déplacement marmotte');
                                        break;
				case 4: console.log('Déplacement marmotte');
                                        break;
				case 5://Déplacement
					console.log('Déplacement marmotte');
					break;
				case 6://Rentre dans le terrier
					console.log('Entrée dans le terrier');
					break;
				case 7://Disparition
					console.log('Disparition marmotte');
                                        tabMarmottes[i].setState(2);
					break;
				default:
					break;
			}			
			//Incrémentation animState
			tabMarmottes[i].setAnimState(tabMarmottes[i].getAnimState()+1);
                        if(tabMarmottes[i].getState()==2){
				tabMarmottes.splice(i, 1); //vire la marmotte morte
			}
                        console.log(sourceAmbiance);
                        console.log(sourceTerrier);
                        console.log(sourceMarmotte);
		}
                
		//Ajout ou non d'une nouvelle marmotte si le nombre maximal de marmottes n'est pas dépassé
		if(tabMarmottes.length<nbMarmottesMax){
			var xMar = Math.max(0,Math.floor(Math.random()*canvas.width-100));
			var yMar = Math.max(0,Math.floor(Math.random()*canvas.height-100));
			tabMarmottes[tabMarmottes.length] = new Marmotte.prototype.init(xMar,yMar,1,0,0,context);
			tabMarmottes[tabMarmottes.length-1].prepareToMove(Math.max(0,Math.floor(Math.random()*canvas.width-100)),Math.max(0,Math.floor(Math.random()*canvas.height-100)));      
                }
		
		//-------------CHRONOMETRE--------------- FIN DU JEU
		if(chrono.getTimeStamp()==0){
			clearInterval(animateInterval);
			clearInterval(dataInterval);
			endGame();
		}
		
	}
}

function endGame(){
    // on arrête les sons
    sourceAmbiance.stop(0);
    sourceTerrier.stop(0);
    sourceMarmotte.stop(0);
    
    // on affiche le score 
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillText("Félicitations vous avez obtenu un score de "+scoreValue,300,100);
    register_score();
}

// on change les coordonnées de la marmotte de repère pour coller avec le repère de Webaudio
function repereAudio(xCanvas, zCanvas) {
    var pointRes = { 'x': 0, 'z': 0 };
    
    // on fait une mise à l'échelle des coordoonées pour obtenir quelque chose entre 0 et 1
    var a = xCanvas / canvas.width;
    var b = zCanvas / canvas.height;
    // -> valeurs entre 0 et 1
    
    
    // on multiplie par 8 pour amplifier la sensation entendue (choix empirique)
    pointRes.x = 8.0 * (2.0*a - 1.0);
    pointRes.z = 8.0 * (2.0*b - 1.0);
    // -> valeurs entre -8 et 8
    
    return pointRes;
}

//deprecated
/*function canvas_click(event){
	var x = event.clientX;
	var y = event.clientY;
	
	for(var i =0; i<tabMarmottes.length; i++){
		if(x >= tabMarmottes[i].getX() && x <= tabMarmottes[i].getX()+tabMarmottes[i].outputPrint.width && y >= tabMarmottes[i].getY() && y <= tabMarmottes[i].getY()+tabMarmottes[i].outputPrint.height){
			tabMarmottes[i].perdreVie();
			scoreValue++;
                        // son de réussite
                        sourceMarteau = audio.playSound(5, sourceMarteau, false, false, null);
                        sourceMarmotte.stop(0);
                        sourceTerrier.stop(0);
		}
                else {
                    sourceMarteau = audio.playSound(4, sourceMarteau, false, false, null);
                }
	}
}*/

//-------------KEYBOARD HANDLER--------------


document.onkeyup = function applyKey(e){
	//Récupération des codes des touches
	//console.log(window.event.keyCode);
	var xMin;
	var yMin;
	var xMax;
	var yMax;
        
        var validKey = false;
	
	if(window.event){
		keyPressed = window.event.keyCode;
	}else{
		keyPressed = e.which;
	}
	
	switch(keyPressed){
		case 82: //r & 7
			xMin = 0;
			yMin = 0;
			xMax = canvas.width/3;
			yMax = canvas.height/3;
                        validKey = true;
			break;
		case 84: //t & 8
			xMin = canvas.width/3;
			yMin = 0;
			xMax = canvas.width/1.5;
			yMax = canvas.height/3;
                        validKey = true;
			break;
		case 89: //y & 9
			xMin = canvas.width/1.5;
			yMin = 0;
			xMax = canvas.width;
			yMax = canvas.height/3;
                        validKey = true;
			break;
		case 70: //f & 4
			xMin = 0;
			yMin = canvas.height/3;
			xMax = canvas.width/3;
			yMax = canvas.height/1.5;
                        validKey = true;
			break;
		case 71: //g & 5
			xMin = canvas.width/3;
			yMin = canvas.height/3;
			xMax = canvas.width/1.5;
			yMax = canvas.height/1.5;
                        validKey = true;
			break;
		case 72: //h & 6
			xMin = canvas.width/1.5;
			yMin = canvas.height/3;
			xMax = canvas.width;
			yMax = canvas.height/1.5;
                        validKey = true;
			break;
		case 86: //v & 1
			xMin = 0;
			yMin = canvas.height/1.5;
			xMax = canvas.width/3;
			yMax = canvas.height;
                        validKey = true;
			break;
		case 66: //b & 2
			xMin = canvas.width/3;
			yMin = canvas.height/1.5;
			xMax = canvas.width/1.5;
			yMax = canvas.height;
                        validKey = true;
			break;
		case 78: //n & 3
			xMin = canvas.width/1.5;
			yMin = canvas.height/1.5;
			xMax = canvas.width;
			yMax = canvas.height;
                        validKey = true;
			break;			
		default:
                        validKey = false;
			break;
	}
	
	var hitTest=false;
	//console.log('['+xMin+','+yMin+'] ['+xMax+','+yMax+']');
	//TEST MARMOTTES DANS LA ZONE
	for(var i =0; i<tabMarmottes.length; i++){
		if((xMax >= tabMarmottes[i].getX() && xMin <= tabMarmottes[i].getX()+tabMarmottes[i].outputPrint.width && yMax >= tabMarmottes[i].getY() && yMin <= tabMarmottes[i].getY()+tabMarmottes[i].outputPrint.height)
                &&(tabMarmottes[i].getLife()!=0)){
                        // la marmotte est touchée
                        sourceMarteau = audio.playSound(5, sourceMarteau, false, false, null);
                        sourceMarmotte.stop(0);
                        sourceTerrier.stop(0);
                        tabMarmottes[i].perdreVie();
			scoreValue+=5;
			hitTest=true;
		}
	}
	if((!hitTest)&&(validKey)){
                // la marmotte est ratée
                sourceMarteau = audio.playSound(4, sourceMarteau, false, false, null);
		scoreValue--;
	}
	
}

function canvas_over(event){
	//Récupération coordonnées souris
	
	//update position souris
}

function canvas_move(event){
	//Récupération coordonnées souris
	//update position souris
	if(botte!=undefined){
		botte.update(event.clientX,event.clientY);
	}
}

function canvas_out(event){

}

function register_score(){
	//AJAX
	sendReq('GET',true,'./registerScore.php','score='+scoreValue,printScore,null);
}

function printScore(){
	var reponse = JSON.parse(response);
	for(var i = 0; i<reponse.length;i++){
		context.fillText(reponse[i][0]+' '+reponse[i][1],400,200+i*100);
	}
}


/*
STUFF TO DO

- Marmotte qui bouge -> r�glage vitesse -> utiliser la fonction animation pour mettre � jour //DONE
- chronometre pour la fin du jeu // DONE
- page de pr�paration (statique avant le jeu)
- enregistrement du score par ajax
- changer �tat d'animation des marmottes
- modifier niveau en fonction du score et du coup modifier le nombre de marmottes affich�es simultan�ment //DONE
- mettre le jeu en pause

*/
