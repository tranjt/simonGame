const lightButtons = document.querySelectorAll("div.lightButton");
const audioFiles = document.querySelectorAll("audio.audioFile");
const startButton = document.querySelector("button#startButton");
const strictLightButton = document.querySelector("button#strictButton");
const onOffButton = document.querySelector("button#onOffButton");
const gameCounter = document.querySelector("h1#gameCounter");
const gameAnnouncement = document.querySelector("div#gameAnnouncement");
const gameAnnouncementText = document.querySelector("div#gameAnnouncementText");
const okButton = document.querySelector("button#okButton");

strictLightButton.addEventListener('click', strictOnOff);
onOffButton.addEventListener('click', gameOnOff); 
startButton.addEventListener('click', gameStart); 
okButton.addEventListener('click', gameStart);
lightButtons.forEach(function(button) {
	button.addEventListener('click', makeMove); 
});

//pubsub
const events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

//Handle onoff button events, Inform the simongame onOffButton have been clicked
function gameOnOff() {	
	events.emit("TurnOnOff", "");
}
//Handle startButton/okButton events, Inform the simongame startButton/okButton have been clicked
function gameStart() {	
	events.emit("StartGame", "");
}
//Handle user lightButton click event, Inform the simongame a lightButton with id have been clicked
function makeMove(event){
	events.emit("PlayerHasMoved", event.target.className.split(" ")[1]);
}
//Handle strictLightButton event, Inform the simongame strictLightButton have been clicked
function strictOnOff() {	
	events.emit("StrictOnOff", strictLightButton);
}

/*
	Game Board
*/

const GameBoard = function (buttons, sounds) { 
	this.buttons = buttons;
	this.sounds = sounds;	
}
//Light Button blink by changing to a lighter/darker background color with css class
//then back to orginal after preset time 550 ms.
GameBoard.prototype.buttonBlink = function(index, cssClass) {	
	this.buttons[index].classList.add(cssClass);
	setTimeout(() => {
		this.buttons[index].classList.remove(cssClass);
	}, 550);
}

GameBoard.prototype.playsound = function(index) {	
	this.sounds[index].currentTime = 0;
	this.sounds[index].play();	
}

/*
	Game Option
*/
const GameOption = function() {
	this.strict = false;
	this.onoffState = false;	
	this.gameCounter = 0;
}
//Handle on/off button on game option panel
GameOption.prototype.setOnOff = function() {
	//toggle button on/off
	this.gameOption.onoffState = this.gameOption.onoffState ? false : true;
	//If is On-state set game counter to display "--"
	if (this.gameOption.onoffState) {
		this.gameOption.gameCounter = "--";
	}
	//If Off-state reset all simon game states
	else {
		this.gameOption.gameCounter = "";		
		this.playedList = [];
		this.currentSelect = 0;
		this.playerTurn = false;
		this.gameOption.strict = false;
		strictLightButton.classList.remove("strict");	
		startButton.classList.remove("start");
	}
	//update changed game counter value in html
	this.gameOption.updateGameCounter(gameCounter);	
}

//display game counter value in html
GameOption.prototype.updateGameCounter = function(htmlgameCounter) {
	htmlgameCounter.innerHTML = this.gameCounter;
}

//display game counter as error state "!!!!!" for 600ms then change back to normal value
GameOption.prototype.displayeError = function(htmlgameCounter) {	
	htmlgameCounter.innerHTML = "!!!!!";
	setTimeout(() => {
		htmlgameCounter.innerHTML = this.gameCounter;
	}, 600);
}

//Set strict value true/false, if true change font color to red on strict button to reflect active
GameOption.prototype.setStrict = function(strictLightButton) { 
	if (this.gameOption.onoffState) {
		this.gameOption.strict  = this.gameOption.strict ? false : true;
		if (this.gameOption.strict) strictLightButton.classList.add("strict");
		else  strictLightButton.classList.remove("strict");	
	}
}

/*
	Simon Game
*/
const SimonGame = function (gameBoard, gameOption) {	
	this.gameBoard = gameBoard;
	this.gameOption = gameOption;
	this.playedList = [];
	this.currentSelect = 0;
	this.playerTurn = false;
}

//hook up listener	
SimonGame.prototype.init = function() { 
	events.on("PlayerHasMoved", this.handlePlayerClick.bind(this)); 	
	events.on("StartGame", this.reStart.bind(this)); 
	events.on("TurnOnOff", this.gameOption.setOnOff.bind(this));	
	events.on("StrictOnOff", this.gameOption.setStrict.bind(this));	
}

SimonGame.prototype.reStart = function() { 
	//check if game is on
	if (this.gameOption.onoffState) {
		//hide gameAnnouncement/wrapper case restart via okButton
		gameAnnouncement.classList.add('hidden');
		wrapper.classList.add('hidden');
		// reset all simon game states and display game counter
		this.playedList = [];
		this.currentSelect = 0;
		this.playerTurn = false;
		this.gameOption.gameCounter = 0;		
		this.gameOption.updateGameCounter(gameCounter);	
		startButton.classList.add("start");
		this.doNextMove(true);
	}
}

SimonGame.prototype.handlePlayerClick = function(index) {
	//make sure it's players turn ie simongame is not currently playing sound sequense
	//and the game is on
	 if (this.playerTurn && this.gameOption.onoffState) {
	 	//lock out player after click 	 	
	 	this.playerTurn = false;
	 	//check if corrent light button clicked 		
	 	let isValidMove = this.validateMove(index);	
	 	//display right/wrong button clicked
	 	this.buttonLightResponse(isValidMove, index);
	 	//make sure 600ms have past before continue
	 	//to ensure the sound and blink can complete
		setTimeout(() => {				
			if (isValidMove) {
				this.currentSelect++;
				//check if player got the whole current sound sequense correct								 				
				if (this.currentSelect === this.playedList.length) {
					//check if game is over, game is over if player get 20 correct in a row
					if (this.gameOption.gameCounter === 20) {
						this.gameOver();
						return;
					}
					//if not over get next playsequense				
					this.doNextMove(isValidMove);
					return;
				}
				this.playerTurn = true; //player can click light buttons again after 600ms				
			}
			else {
				//if player got a wrong light button state and game is in strict mode restart game	
				if (this.gameOption.strict) {
					this.reStart();
					return;
				}
				//if player got a wrong light button state and replay sound sequense from the start
				else {			
					this.doNextMove(isValidMove);
				}	
			}			 
		}, 600);
	}	
}

//display right/wrong button clicked
SimonGame.prototype.buttonLightResponse = function(isValidMove, lightButtonIndex) { 	
		if (isValidMove) {
	 		this.gameBoard.buttonBlink(lightButtonIndex, "light");
			this.gameBoard.playsound(lightButtonIndex);
	 	}
	 	else {
			this.gameOption.displayeError(gameCounter);
	 		this.gameBoard.buttonBlink(lightButtonIndex, "dark");	 
			this.gameBoard.playsound(lightButtonIndex);
	 	}
}

//handle game over display a win msg
SimonGame.prototype.gameOver = function() { 	
		gameAnnouncementText.innerHTML = "Congratulations you have won!";
		wrapper.classList.remove('hidden');
		gameAnnouncement.classList.remove('hidden');
}

//make sure light buttons is clicked in correct sequense
SimonGame.prototype.validateMove = function(index) { 	
	if (this.playedList[this.currentSelect] === parseInt(index) ) {			
		return true;
	}		
	return false;
}

//play sound/light sequense
SimonGame.prototype.playSequence = function(stepList) { 
	//make sure player can't click while playing the sequense
	this.playerTurn = false;
	for (let i = 0; i < stepList.length; i++) {
		//make sure each sound/light is played 600ms apart
		setTimeout(() => {			
			this.gameBoard.buttonBlink(stepList[i], "light");
			this.gameBoard.playsound(stepList[i]);
			//enable player click after sequense is done
			if (i === (stepList.length-1)) this.playerTurn = true;
		}, 600*i);
	}
}

//handles generation of new state to sound/light sequense and play the sequense
//doNext value dictates if new state should be made and added to current sound/light sequense or not
SimonGame.prototype.doNextMove = function(doNext) { 
	this.currentSelect = 0;		
	if (doNext) {
		this.playedList.push(Math.floor(Math.random()*4));
		this.gameOption.gameCounter++;
		this.gameOption.updateGameCounter(gameCounter);
	}
	//delay 1500ms before playing the current sound/light sequense 
	setTimeout(() => {		
		this.playSequence(this.playedList);				
	}, 1500);				
}

const newgameBoard = new GameBoard(lightButtons, audioFiles);
const newgameOption = new GameOption();
const newgame = new SimonGame(newgameBoard, newgameOption); 
newgame.init();




