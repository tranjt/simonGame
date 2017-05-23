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


function gameOnOff() {	
	events.emit("TurnOnOff","");
}

function gameStart() {	
	events.emit("StartGame", "");
}

function makeMove(event){
	events.emit("PlayerHasMoved", event.target.className.split(" ")[1]);
}

function strictOnOff() {	
	events.emit("StrictOnOff", strictLightButton);
}

// //Ok button, Restart game once game is over
// function confirm(event){
// 	events.emit("StartGame", "");
// }
/*
	Game Board
*/
const GameBoard = function (buttons = lightButtons, sounds = audioFiles) { 
	this.buttons = buttons;
	this.sounds = sounds;	
}

GameBoard.prototype.buttonBlink = function(index, cssClass) {	
	this.buttons[index].classList.add(cssClass);
	setTimeout(() => {
		this.buttons[index].classList.remove(cssClass);
	}, 550);
}

GameBoard.prototype.playsound = function(index) {	
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

GameOption.prototype.setOnOff = function() {
	this.gameOption.onoffState = this.gameOption.onoffState ? false : true;
	if (this.gameOption.onoffState) {
		this.gameOption.gameCounter = 0;
	}
	else {
		this.gameOption.gameCounter = "";		
		this.playedList = [];
		this.currentSelect = 0;
		this.playerTurn = false;
		this.gameOption.strict = false;
		strictLightButton.classList.remove("strict");	
	}
	this.gameOption.updateGameCounter(gameCounter);	
}

GameOption.prototype.updateGameCounter = function(htmlgameCounter) {
	htmlgameCounter.innerHTML = this.gameCounter;
}

GameOption.prototype.displayeError = function(htmlgameCounter) {	
	htmlgameCounter.innerHTML = "!!!";
	setTimeout(() => {
		htmlgameCounter.innerHTML = this.gameCounter;
	}, 550);
}

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

SimonGame.prototype.init = function() { //hook up listener	
	events.on("PlayerHasMoved", this.handlePlayerClick.bind(this)); 	
	events.on("StartGame", this.reStart.bind(this)); 
	events.on("TurnOnOff", this.gameOption.setOnOff.bind(this));	
	events.on("StrictOnOff", this.gameOption.setStrict.bind(this));	
	//events.on("StartGame", this.reStart.bind(this));
}

SimonGame.prototype.reStart = function() { 
	if (this.gameOption.onoffState) {
		gameAnnouncement.classList.add('hidden');
		wrapper.classList.add('hidden');
		this.playedList = [];
		this.currentSelect = 0;
		this.playerTurn = false;
		this.gameOption.gameCounter = 0;		
		this.gameOption.updateGameCounter(gameCounter);	
		this.doNextMove();
	}
}

SimonGame.prototype.handlePlayerClick = function(index) {
	 if (this.playerTurn && this.gameOption.onoffState) {
	 	this.playerTurn = false;		
	 	let isValidMove = this.validateMove(index);
	 	if (isValidMove) {
	 		this.gameBoard.buttonBlink(index, "light");
			this.gameBoard.playsound(index);
	 	}
	 	else {
			this.gameOption.displayeError(gameCounter);
	 		this.gameBoard.buttonBlink(index, "dark");	 
			this.gameBoard.playsound(index);
	 	}

		setTimeout(() => {				
			if (isValidMove) {
				this.currentSelect++;	 				
				if (this.currentSelect === this.playedList.length ) {

					if(this.gameOption.gameCounter === 20) {
						gameAnnouncementText.innerHTML = "Congratulations you have won!";
						wrapper.classList.remove('hidden');
						gameAnnouncement.classList.remove('hidden');
						return;
					}
					this.currentSelect = 0;					
					this.doNextMove();
					return;
				}
				this.playerTurn = true;				
			}
			else {	
				if (this.gameOption.strict) {
					this.reStart();
					return;
				}	
				else {
					this.currentSelect = 0;
					this.playSequence(this.playedList);
				}	
			}			 
		}, 700);
	}	
}


SimonGame.prototype.validateMove = function(index) { 	
	if (this.playedList[this.currentSelect] === parseInt(index) ) {			
		return true;
	}		
	return false;
}

SimonGame.prototype.playSequence = function(stepList) { 
	this.playerTurn = false;
	for (let i = 0; i < stepList.length; i++) {
		setTimeout(() => {			
			this.gameBoard.buttonBlink(stepList[i], "light");
			this.gameBoard.playsound(stepList[i]);
			if (i === (stepList.length-1)) this.playerTurn = true;
		}, 700 + 700*i);
	}
}

SimonGame.prototype.doNextMove = function() { 	
	this.playedList.push(Math.floor(Math.random()*4));
	this.gameOption.gameCounter++;
	
	setTimeout(() => {
		this.playSequence(this.playedList);		
		this.gameOption.updateGameCounter(gameCounter);
	}, 1000);			
}

const newgameBoard = new GameBoard();
const newgameOption = new GameOption();
const newgame = new SimonGame(newgameBoard, newgameOption); 
newgame.init();


//User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
//do a wrapper display msg on top when 20 reached, ok button restart game 