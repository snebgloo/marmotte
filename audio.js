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
                  
                  // si tous les fichiers sont chargés, on crée les murs
                  if (++caller.loadedSounds == urlList.length) {
                      murDevant = new Mur.prototype.init(contextAudio, 14, bufferList[3], 0.3);
                      murDerriere = new Mur.prototype.init(contextAudio, -2, bufferList[3], 0.3);
                                           
                                           
                      murDevant.output.connect(contextAudio.destination);
                      murDerriere.output.connect(contextAudio.destination);
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
        
        // lecture d'un fichier son i du tableau de buffers
        this.play = function(i) {
            var source = contextAudio.createBufferSource();
            source.buffer = bufferList[i];

            source.connect(contextAudio.destination);
            
            //source.playbackRate.value = 1;
            source.start(i);
       
         };
    
    
        // la source et le panner sont globaux pour le son binaural parce que ces variables sont modifiées selon la position de la marmotte dans le main
        this.playMovingSound = function(i, playback) {
            
         
             source = contextAudio.createBufferSource();
             source.buffer = bufferList[i];
             //source.loop = true;
             source.playbackRate.value = playback;
            
            
            murDevant.connect(source);
            murDerriere.connect(source);
            
             // son envoyé de la même façon dans toutes les directions ?
             panner = contextAudio.createPanner();
//             panner.coneOuterGain = 1;
//             panner.coneOuterAngle = 360;
//             panner.coneInnerAngle = 0;
            
             // correspondance à échelle logarithmique de l'oreille
             panner.refDistance = 0.01;
             panner.rolloffFactor = 0.1;
            
            
             // audio graph
             source.connect(panner);
            
             panner.connect(contextAudio.destination);
            
             source.start(0);

             
        }
    
    

};
