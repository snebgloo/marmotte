var Audio = function(){
	

};

Audio.prototype.init = function(){

    this.loadedSounds = 0;

	// création de l'audioContext et chargement des fichiers audio
	this.initContext = function() {
		try {
	   		// le nom de la propriété change selon le navigateur
	    		window.AudioContext = window.AudioContext||window.webkitAudioContext;
                        
                        // on crée le contexte audio et le panner pour gérer la spatialisation
	    		contextAudio = new AudioContext();
                        //panner = contextAudio.createPanner();
            
                        // On positionne le listener représentant le joueur au centre du repère audio
                        //contextAudio.listener.setPosition(0.5,-0.5,0);
	 	}
	  	catch(e) {
	    		alert('Web Audio API ne marche pas sur votre navigateur Internet :(');
	  	}
                
                this.loadSounds();
                
        };

        this.loadSound = function(index) {
            
            // Chargement du fichier audio en asynchrone
            var request = new XMLHttpRequest();
            request.open("GET", urlList[index], true);
            request.responseType = "arraybuffer";
            
            caller = this;

            request.onload = function() {
              // Décode l'audio en asynchrone aussi, et l'ajoute dans le tableau de buffers
              contextAudio.decodeAudioData(
                request.response,
                function(buffer) {
                  if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                  }
                  bufferList[index] = buffer;
                  
                  // si tous les fichiers sont chargés, on crée les murs et on joue le son d'ambiance
                  if (++caller.loadedSounds == urlList.length) {
                      // son d'ambiance
                      sourceAmbiance = caller.playSound(3, sourceAmbiance, true, false, null);
                                           
                      murDevant = new Mur.prototype.init(contextAudio, 14, bufferList[1], 0.3);
                      murDerriere = new Mur.prototype.init(contextAudio, -2, bufferList[1], 0.3);               
                                           
                      murDevant.output.connect(contextAudio.destination);
                      murDerriere.output.connect(contextAudio.destination);
                      var fullyLoaded = new Event("fullyLoaded");
                      document.dispatchEvent(fullyLoaded);
                  }
                },
                function(error) {
                  console.error('decodeAudioData error', error);
                }
              );
            };

            request.onerror = function() {
              alert('BufferLoader: XHR error');
            };

            request.send();
        };
        
        this.loadSounds = function() {
            for (var i = 0; i < urlList.length; i++) {
                this.loadSound(i);
            }
        }; 
        
        // lecture d'un fichier son i, avec sa source associée et la variable de boucle du son, de spatialisation et de panner
        this.playSound = function(i, source, loopVar, spatializeVar, pannerVar) {
            source = contextAudio.createBufferSource();
            source.buffer = bufferList[i];

            if(spatializeVar) {
                murDevant.connect(source);
                murDerriere.connect(source);

                
                // marmotte
                if(pannerVar == 0) {
                    // le panner gère l'emplacement de la source audio jouée
                    pannerMarmotte = contextAudio.createPanner();

                    // correspondance à échelle logarithmique de l'oreille
                    pannerMarmotte.refDistance = 0.01;
                    pannerMarmotte.rolloffFactor = 0.1;

                    // connexion au graphe audio
                    source.connect(pannerMarmotte);
                    pannerMarmotte.connect(contextAudio.destination);
                }
                // terrier
                else {
                    // le panner gère l'emplacement de la source audio jouée
                    pannerTerrier = contextAudio.createPanner();

                    // correspondance à échelle logarithmique de l'oreille
                    pannerTerrier.refDistance = 0.01;
                    pannerTerrier.rolloffFactor = 0.1;

                    // connexion au graphe audio
                    source.connect(pannerTerrier);
                    pannerTerrier.connect(contextAudio.destination);
                }

            }
            else {
                source.connect(contextAudio.destination);
                source.loop = loopVar;
                
            }
            // lecture du son
            source.start(0);
            return source;
       
         };
    
    
    

};
